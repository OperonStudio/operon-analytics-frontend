import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  getActiveEnvironmentId,
  getActiveProjectId,
  getActiveWorkspaceId,
  setActiveEnvironmentId,
  setActiveProjectId,
  setActiveWorkspaceId,
  subscribeToScope,
} from "#/common/active-scope";
import type { Scope } from "#/common/api/endpoints";
import {
  environmentsQuery,
  projectsQuery,
  workspacesQuery,
} from "#/common/api/platform";

const EMPTY_SCOPE: Scope = {
  workspaceId: "",
  projectId: "",
  environmentId: "",
};

function storedScope(): Scope {
  return {
    workspaceId: getActiveWorkspaceId(),
    projectId: getActiveProjectId(),
    environmentId: getActiveEnvironmentId(),
  };
}

// useSyncExternalStore compares by reference, so the same object has to come
// back for an unchanged scope or every render would look like a change.
let snapshot = EMPTY_SCOPE;

function getSnapshot(): Scope {
  const next = storedScope();
  if (
    next.workspaceId !== snapshot.workspaceId ||
    next.projectId !== snapshot.projectId ||
    next.environmentId !== snapshot.environmentId
  ) {
    snapshot = next;
  }
  return snapshot;
}

/**
 * The workspace, project and environment every scoped query is keyed by.
 *
 * A stored id is only honoured if it still exists: a project someone deleted,
 * or one belonging to a workspace the user has since left, otherwise sends
 * every request to something that is not there. When it does not resolve, the
 * first of what does exist is selected, so the console is usable on a fresh
 * browser without anyone choosing anything.
 *
 * The three lists come from the platform API, not from the analytics service.
 * Analytics is a reader of these records and, now, a writer of them too, but
 * both go through the one service that owns them.
 */
export function useScope() {
  const stored = useSyncExternalStore(
    subscribeToScope,
    getSnapshot,
    () => EMPTY_SCOPE,
  );

  const { data: workspaces = [], isLoading: loadingWorkspaces } =
    useQuery(workspacesQuery);

  const workspace =
    workspaces.find((w) => w.id === stored.workspaceId) ?? workspaces[0];
  const workspaceId = workspace?.id ?? "";

  const { data: projects = [], isLoading: loadingProjects } = useQuery(
    projectsQuery(workspaceId),
  );
  const { data: environments = [], isLoading: loadingEnvironments } = useQuery(
    environmentsQuery(workspaceId),
  );

  const project =
    projects.find((p) => p.id === stored.projectId) ?? projects[0];
  const environment =
    environments.find((e) => e.id === stored.environmentId) ?? environments[0];

  // Memoised because the effect below depends on it: a fresh object every
  // render would re-run the write on every render.
  const projectId = project?.id ?? "";
  const environmentId = environment?.id ?? "";
  const scope: Scope = useMemo(
    () => ({ workspaceId, projectId, environmentId }),
    [workspaceId, projectId, environmentId],
  );

  // Write the resolution back so a reload starts where this one ended, and so
  // the switcher's highlighted row matches what the queries are actually
  // fetching.
  useEffect(() => {
    if (scope.workspaceId && scope.workspaceId !== stored.workspaceId) {
      setActiveWorkspaceId(scope.workspaceId);
    }
    if (scope.projectId && scope.projectId !== stored.projectId) {
      setActiveProjectId(scope.projectId);
    }
    if (scope.environmentId && scope.environmentId !== stored.environmentId) {
      setActiveEnvironmentId(scope.environmentId);
    }
  }, [scope, stored]);

  const isLoading =
    loadingWorkspaces ||
    (Boolean(workspaceId) && (loadingProjects || loadingEnvironments));

  // `needsSetup` is what the onboarding gate keys off. It is deliberately not
  // "no workspaces": a workspace with no environment or no project cannot serve
  // a tracker either, and treating those as ready produced a console whose
  // every panel was an unexplained empty state.
  const needsSetup =
    !isLoading &&
    (workspaces.length === 0 ||
      environments.length === 0 ||
      projects.length === 0);

  return {
    scope,
    needsSetup,
    workspaces,
    projects,
    environments,
    workspace,
    project,
    environment,
    isLoading,
    /** True once every scoped query has the ids it needs. */
    isReady: Boolean(
      scope.workspaceId && scope.projectId && scope.environmentId,
    ),
    setWorkspace: setActiveWorkspaceId,
    setProject: setActiveProjectId,
    setEnvironment: setActiveEnvironmentId,
  };
}

export type { Scope };
