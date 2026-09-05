import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { operonApiClient } from "#/libs/apiClient";
import type { Environment, Project, Workspace } from "./types";

/**
 * The platform API: workspaces, environments, projects and API keys.
 *
 * These are not Analytics' records. They belong to every Operon product and are
 * served by operon-homepage-backend, which the dev server proxies under
 * `/platform` so the browser still only talks to one origin and the session
 * cookie still applies.
 *
 * Analytics used to read them through its own backend and could not write them
 * at all, so the console's answer to "you have no workspace yet" was a link to
 * Compose. Somebody who bought Analytics alone had to set up a product they
 * were not using before they could use the one they were. It writes them here
 * now, against the same service every other console writes to, so there is
 * still exactly one place a workspace can be created.
 */
const PLATFORM = "/platform/api";

/** The product tag new projects are created with and lists are filtered by. */
export const PRODUCT = "analytics";

export const PlatformEndpoints = {
  WORKSPACES: `${PLATFORM}/workspaces`,

  WORKSPACE: (workspaceId: string) => `${PLATFORM}/workspaces/${workspaceId}`,

  ENVIRONMENTS: (workspaceId: string) =>
    `${PLATFORM}/workspaces/${workspaceId}/environments`,

  // Projects are listed per product so this console offers the projects it was
  // set up for, rather than every project in the workspace.
  PROJECTS: (workspaceId: string) =>
    `${PLATFORM}/workspaces/${workspaceId}/projects?product=${PRODUCT}`,

  CREATE_PROJECT: (workspaceId: string) =>
    `${PLATFORM}/workspaces/${workspaceId}/projects`,

  PROJECT: (workspaceId: string, projectId: string) =>
    `${PLATFORM}/workspaces/${workspaceId}/projects/${projectId}`,

  API_KEYS: (workspaceId: string) =>
    `${PLATFORM}/workspaces/${workspaceId}/api-keys`,

  REGENERATE_KEY: (workspaceId: string, projectId: string) =>
    `${PLATFORM}/workspaces/${workspaceId}/api-keys/${projectId}`,
} as const;

export const platformKeys = {
  workspaces: () => ["platform", "workspaces"] as const,
  environments: (workspaceId: string) =>
    ["platform", "workspaces", workspaceId, "environments"] as const,
  projects: (workspaceId: string) =>
    ["platform", "workspaces", workspaceId, "projects"] as const,
  apiKeys: (workspaceId: string, environmentId: string) =>
    ["platform", "workspaces", workspaceId, "api-keys", environmentId] as const,
} as const;

// ── Reads ───────────────────────────────────────────────────────────────────

/**
 * A function, not a module-scope constant.
 *
 * `queryOptions({ queryKey: <keys>.workspaces(), ... })` evaluated while this
 * module is being defined reads the key builder during module evaluation. The
 * builder lives in another module, the bundler split the two into chunks that
 * import each other, and the chunk holding this file ran first — so the builder
 * was still undefined and the SSR bundle threw
 * "Cannot read properties of undefined (reading 'workspaces')" before it served
 * a single route. Every sibling query here already took a parameter and was
 * therefore lazy, which is why this was the only one that fell over.
 *
 * Deferring the call to render time removes the dependency on chunk evaluation
 * order entirely, rather than relying on the bundler to keep grouping these
 * modules the way it happens to today.
 */
export const workspacesQuery = () =>
  queryOptions({
    queryKey: platformKeys.workspaces(),
    queryFn: async () =>
      await operonApiClient.get<Workspace[]>(PlatformEndpoints.WORKSPACES),
  });

export const environmentsQuery = (workspaceId: string) =>
  queryOptions({
    queryKey: platformKeys.environments(workspaceId),
    queryFn: async () =>
      await operonApiClient.get<Environment[]>(
        PlatformEndpoints.ENVIRONMENTS(workspaceId),
      ),
    enabled: Boolean(workspaceId),
  });

export const projectsQuery = (workspaceId: string) =>
  queryOptions({
    queryKey: platformKeys.projects(workspaceId),
    queryFn: async () =>
      await operonApiClient.get<Project[]>(
        PlatformEndpoints.PROJECTS(workspaceId),
      ),
    enabled: Boolean(workspaceId),
  });

/**
 * The keys for one environment, grouped by project.
 *
 * The plaintext is not in here. It is returned once when the key is minted and
 * never stored in a readable form, so this can say which projects have a key
 * and what its prefix is, and nothing more.
 */
export interface ProjectKeys {
  id: string;
  name: string;
  keys: {
    id: string;
    projectId: string;
    environment: string;
    name: string;
    prefix: string;
    createdAt: string;
  }[];
}

export const apiKeysQuery = (workspaceId: string, environmentId: string) =>
  queryOptions({
    queryKey: platformKeys.apiKeys(workspaceId, environmentId),
    queryFn: async () =>
      await operonApiClient.get<ProjectKeys[]>(
        `${PlatformEndpoints.API_KEYS(workspaceId)}?environment=${environmentId}`,
      ),
    enabled: Boolean(workspaceId && environmentId),
  });

// ── Writes ──────────────────────────────────────────────────────────────────

export const createWorkspaceMutation = mutationOptions({
  mutationFn: async (name: string) =>
    await operonApiClient.post<Workspace>(PlatformEndpoints.WORKSPACES, {
      name,
    }),
});

export const createEnvironmentMutation = (workspaceId: string) =>
  mutationOptions({
    mutationFn: async (name: string) =>
      await operonApiClient.post<Environment>(
        PlatformEndpoints.ENVIRONMENTS(workspaceId),
        { name },
      ),
  });

export const createProjectMutation = (workspaceId: string) =>
  mutationOptions({
    mutationFn: async (input: { name: string; description?: string }) =>
      await operonApiClient.post<Project>(
        PlatformEndpoints.CREATE_PROJECT(workspaceId),
        { ...input, products: [PRODUCT] },
      ),
  });

/**
 * Mints a key for one project in one environment.
 *
 * The plaintext comes back exactly once, in this response. Nothing can read it
 * again afterwards, which is why the install step shows it immediately rather
 * than offering to look it up later.
 */
export interface MintedKey {
  id: string;
  projectId: string;
  environment: string;
  prefix: string;
  plaintextValue: string;
  createdAt: string;
}

export const regenerateKeyMutation = (workspaceId: string) =>
  mutationOptions({
    mutationFn: async ({
      projectId,
      environmentId,
    }: {
      projectId: string;
      environmentId: string;
    }) =>
      await operonApiClient.post<MintedKey>(
        `${PlatformEndpoints.REGENERATE_KEY(workspaceId, projectId)}?environment=${environmentId}`,
        {},
      ),
  });
