/**
 * Every Analytics API path in one place.
 *
 * A tracker belongs to a project and an environment, not to a workspace, so
 * most of these carry both. That is what makes "on in staging, off in
 * production" expressible; a workspace-wide switch could not say it.
 */
type Scope = {
  workspaceId: string;
  projectId: string;
  environmentId: string;
};

function scoped(scope: Scope, path: string, extra?: Record<string, string>) {
  const params = new URLSearchParams({
    projectId: scope.projectId,
    environmentId: scope.environmentId,
    ...extra,
  });
  return `/api/workspaces/${scope.workspaceId}${path}?${params}`;
}

export const AnalyticsEndpoints = {
  // Workspaces, projects and environments are not here. They are the
  // platform's, and live in common/api/platform.ts against the service that
  // owns them.

  TRACKERS: (scope: Scope) => scoped(scope, "/trackers"),

  TRACKER: (scope: Scope, trackerId: string) =>
    scoped(scope, `/trackers/${trackerId}`),

  TRACKER_ENABLED: (scope: Scope, trackerId: string) =>
    scoped(scope, `/trackers/${trackerId}/enabled`),

  EVENTS: (scope: Scope, limit = 100) =>
    scoped(scope, "/events", { limit: String(limit) }),

  OVERVIEW: (scope: Scope, days = 7) =>
    scoped(scope, "/overview", { days: String(days) }),

  // Context variables are workspace-wide: a variable named `userId` means the
  // same thing in every project, and duplicating it per environment would only
  // create ways for the two to disagree.
  CONTEXT_VARIABLES: (workspaceId: string) =>
    `/api/workspaces/${workspaceId}/contexts`,

  CONTEXT_VARIABLE: (workspaceId: string, contextId: string) =>
    `/api/workspaces/${workspaceId}/contexts/${contextId}`,
} as const;

export type { Scope };
