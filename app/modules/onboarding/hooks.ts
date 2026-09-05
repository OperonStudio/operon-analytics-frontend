import { toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getActiveEnvironmentId,
  getActiveProjectId,
  getActiveWorkspaceId,
  setActiveEnvironmentId,
  setActiveProjectId,
  setActiveWorkspaceId,
} from "#/common/active-scope";
import {
  createEnvironmentMutation,
  createProjectMutation,
  createWorkspaceMutation,
  environmentsQuery,
  platformKeys,
  projectsQuery,
  workspacesQuery,
} from "#/common/api/platform";
import type { Environment, Project, Workspace } from "#/common/api/types";

export type OnboardingStep =
  | "idle"
  | "workspace"
  | "environment"
  | "project"
  | "ready";

/**
 * Decides whether the signed-in user can be shown the console yet, and creates
 * what is missing.
 *
 * Analytics needs three things before any screen has a URL to call: a
 * workspace, an environment inside it, and a project. It could previously
 * create none of them, so a new customer's first screen was an empty dropdown
 * and a link to Compose. Every step here writes to the platform API, which is
 * the one service that owns these records, so a workspace made here is the same
 * workspace Compose would have made.
 *
 * The stored ids are repaired as it goes: an id left in this browser may point
 * at a workspace the user has since left or a project someone deleted, and
 * every request built from it would 404 with nothing on screen to explain why.
 */
export function useOnboarding() {
  const qc = useQueryClient();

  const {
    data: workspaces,
    isLoading: workspacesLoading,
    isError: workspacesErrored,
  } = useQuery(workspacesQuery());

  const storedWorkspaceId = getActiveWorkspaceId();
  const workspaceId =
    workspaces?.find((w) => w.id === storedWorkspaceId)?.id ??
    workspaces?.[0]?.id ??
    "";

  useEffect(() => {
    if (workspaceId && workspaceId !== storedWorkspaceId) {
      setActiveWorkspaceId(workspaceId);
    }
  }, [workspaceId, storedWorkspaceId]);

  const {
    data: environments,
    isLoading: environmentsLoading,
    isError: environmentsErrored,
  } = useQuery(environmentsQuery(workspaceId));

  const storedEnvironmentId = getActiveEnvironmentId();
  const environmentId =
    environments?.find((e) => e.id === storedEnvironmentId)?.id ??
    environments?.[0]?.id ??
    "";

  useEffect(() => {
    if (environmentId && environmentId !== storedEnvironmentId) {
      setActiveEnvironmentId(environmentId);
    }
  }, [environmentId, storedEnvironmentId]);

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsErrored,
  } = useQuery(projectsQuery(workspaceId));

  const storedProjectId = getActiveProjectId();
  const projectId =
    projects?.find((p) => p.id === storedProjectId)?.id ??
    projects?.[0]?.id ??
    "";

  useEffect(() => {
    if (projectId && projectId !== storedProjectId) {
      setActiveProjectId(projectId);
    }
  }, [projectId, storedProjectId]);

  // ── Mutations ────────────────────────────────────────────────────────────

  const createWorkspace = useMutation({
    ...createWorkspaceMutation,
    onSuccess: (ws: Workspace) => {
      setActiveWorkspaceId(ws.id);
      qc.invalidateQueries({ queryKey: platformKeys.workspaces() });
      toast.success(`Workspace "${ws.name}" created`);
    },
    onError: () => toast.error("Failed to create workspace"),
  });

  const createEnvironment = useMutation({
    ...createEnvironmentMutation(workspaceId),
    onSuccess: (env: Environment) => {
      setActiveEnvironmentId(env.id);
      qc.invalidateQueries({
        queryKey: platformKeys.environments(workspaceId),
      });
      toast.success(`Environment "${env.name}" created`);
    },
    onError: () => toast.error("Failed to create environment"),
  });

  const createProject = useMutation({
    ...createProjectMutation(workspaceId),
    onSuccess: (project: Project) => {
      setActiveProjectId(project.id);
      qc.invalidateQueries({ queryKey: platformKeys.projects(workspaceId) });
      toast.success(`Project "${project.name}" created`);
    },
    onError: () => toast.error("Failed to create project"),
  });

  // ── Step machine ─────────────────────────────────────────────────────────

  const isLoading =
    workspacesLoading ||
    (Boolean(workspaceId) && (environmentsLoading || projectsLoading));
  const isErrored = workspacesErrored || environmentsErrored || projectsErrored;

  let step: OnboardingStep = "idle";
  if (!isLoading && !isErrored) {
    if (!workspaceId) step = "workspace";
    else if (!environmentId) step = "environment";
    else if (!projectId) step = "project";
    else step = "ready";
  }

  return {
    step,
    isLoading,
    isErrored,
    workspaceId,
    environmentId,
    projectId,
    createWorkspace: (name: string) => createWorkspace.mutate(name),
    isCreatingWorkspace: createWorkspace.isPending,
    createEnvironment: (name: string) => {
      if (!workspaceId) return;
      createEnvironment.mutate(name);
    },
    isCreatingEnvironment: createEnvironment.isPending,
    createProject: (name: string, description?: string) => {
      if (!workspaceId) return;
      createProject.mutate({ name, description });
    },
    isCreatingProject: createProject.isPending,
  };
}
