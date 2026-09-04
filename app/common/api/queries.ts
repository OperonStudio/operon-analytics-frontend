import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { operonApiClient } from "#/libs/apiClient";
import { AnalyticsEndpoints, type Scope } from "./endpoints";
import { queryKeys } from "./query-keys";
import type {
  AnalyticsEvent,
  ContextVariable,
  Overview,
  Tracker,
  TrackerInput,
} from "./types";

/**
 * Every read and write the console makes.
 *
 * These used to call a localStorage stand-in written while the backend did not
 * exist. It does now, so the stand-in is gone: there is no second source of
 * truth for a binding, and nothing shown here is invented locally.
 *
 * Scoped queries are disabled until a project and an environment are known.
 * Firing them earlier produces a 400 on every page load while the switcher is
 * still resolving, and a red error where an empty state belongs.
 */

const isReady = (scope: Scope) =>
  Boolean(scope.workspaceId && scope.projectId && scope.environmentId);

// Scope — the workspaces, projects and environments these queries are keyed
// by — is served by the platform API, not this one. See common/api/platform.ts.

// ── Trackers ────────────────────────────────────────────────────────────────

export const trackersQuery = (scope: Scope) =>
  queryOptions({
    queryKey: queryKeys.trackers(scope),
    queryFn: async () =>
      await operonApiClient.get<Tracker[]>(AnalyticsEndpoints.TRACKERS(scope)),
    enabled: isReady(scope),
  });

export const saveTrackerMutation = (scope: Scope) =>
  mutationOptions({
    mutationFn: async (input: TrackerInput) =>
      await operonApiClient.post<Tracker>(
        AnalyticsEndpoints.TRACKERS(scope),
        input,
      ),
  });

export const deleteTrackerMutation = (scope: Scope) =>
  mutationOptions({
    mutationFn: async (id: string) =>
      await operonApiClient.delete(AnalyticsEndpoints.TRACKER(scope, id)),
  });

export const toggleTrackerMutation = (scope: Scope) =>
  mutationOptions({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) =>
      await operonApiClient.patch<Tracker>(
        AnalyticsEndpoints.TRACKER_ENABLED(scope, id),
        { enabled },
      ),
  });

// ── Events ──────────────────────────────────────────────────────────────────

export const eventsQuery = (scope: Scope) =>
  queryOptions({
    queryKey: queryKeys.events(scope),
    queryFn: async () =>
      await operonApiClient.get<AnalyticsEvent[]>(
        AnalyticsEndpoints.EVENTS(scope),
      ),
    enabled: isReady(scope),
    // The stream is the page's whole purpose, so it keeps itself current
    // rather than making someone reload to find out whether anything arrived.
    refetchInterval: 10_000,
  });

// ── Overview ────────────────────────────────────────────────────────────────

export const overviewQuery = (scope: Scope, days = 7) =>
  queryOptions({
    queryKey: queryKeys.overview(scope, days),
    queryFn: async () =>
      await operonApiClient.get<Overview>(
        AnalyticsEndpoints.OVERVIEW(scope, days),
      ),
    enabled: isReady(scope),
  });

// ── Context variables ───────────────────────────────────────────────────────

export const contextVariablesQuery = (workspaceId: string) =>
  queryOptions({
    queryKey: queryKeys.contextVariables(workspaceId),
    queryFn: async () =>
      await operonApiClient.get<ContextVariable[]>(
        AnalyticsEndpoints.CONTEXT_VARIABLES(workspaceId),
      ),
    enabled: Boolean(workspaceId),
  });

export const saveContextVariableMutation = (workspaceId: string) =>
  mutationOptions({
    mutationFn: async (input: Omit<ContextVariable, "id"> & { id?: string }) =>
      await operonApiClient.post<ContextVariable>(
        AnalyticsEndpoints.CONTEXT_VARIABLES(workspaceId),
        input,
      ),
  });

export const deleteContextVariableMutation = (workspaceId: string) =>
  mutationOptions({
    mutationFn: async (id: string) =>
      await operonApiClient.delete(
        AnalyticsEndpoints.CONTEXT_VARIABLE(workspaceId, id),
      ),
  });
