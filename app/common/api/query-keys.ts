import type { Scope } from "./endpoints";

/**
 * Cache keys for Analytics.
 *
 * Anything a tracker is scoped by is part of its key. Leaving the project and
 * environment out meant switching either one served the previous scope's data
 * from cache, which is the kind of bug that gets noticed as "the toggle did
 * nothing" long after the switch that caused it.
 */
const scopePath = (scope: Scope) =>
  [
    "workspaces",
    scope.workspaceId,
    "projects",
    scope.projectId,
    "environments",
    scope.environmentId,
  ] as const;

export const queryKeys = {
  // Scope lists are keyed under "platform" by common/api/platform.ts, so a
  // workspace created there invalidates in one place.
  trackers: (scope: Scope) => [...scopePath(scope), "trackers"] as const,
  events: (scope: Scope) => [...scopePath(scope), "events"] as const,
  overview: (scope: Scope, days: number) =>
    [...scopePath(scope), "overview", days] as const,

  contextVariables: (workspaceId: string) =>
    ["workspaces", workspaceId, "contexts"] as const,
} as const;
