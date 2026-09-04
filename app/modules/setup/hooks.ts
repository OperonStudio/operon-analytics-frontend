import { toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  apiKeysQuery,
  type MintedKey,
  platformKeys,
  regenerateKeyMutation,
} from "#/common/api/platform";
import { eventsQuery } from "#/common/api/queries";
import { useScope } from "#/common/scope";

/**
 * One environment's integration status.
 *
 * `hasKey` is the only thing the console can know for certain. A key's
 * plaintext is returned once at creation and never stored in a readable form,
 * so this can say that an environment has been issued a key and what its prefix
 * is, and nothing more.
 */
export interface EnvironmentStatus {
  id: string;
  name: string;
  hasKey: boolean;
  prefix: string;
  isCurrent: boolean;
}

/**
 * Drives the install page: the key for the current environment, whether events
 * are arriving, and what is left to do in the other environments.
 */
export function useSetup() {
  const qc = useQueryClient();
  const { scope, project, environment, environments, isReady } = useScope();

  // The plaintext of a key just minted here. It is held in component state and
  // nowhere else, because this is the only moment it exists in readable form.
  const [minted, setMinted] = useState<Record<string, string>>({});

  const { data: keyGroups = [], isLoading: keysLoading } = useQuery(
    apiKeysQuery(scope.workspaceId, scope.environmentId),
  );

  // Events for the current scope answer the only question that matters after
  // installing: is anything actually arriving? A tracker list cannot tell you
  // that, because a tracker exists whether or not the SDK ever ran.
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    ...eventsQuery(scope),
    refetchInterval: 5_000,
  });

  const currentKey = useMemo(() => {
    const group = keyGroups.find((g) => g.id === scope.projectId);
    return group?.keys.find((k) => k.environment === scope.environmentId);
  }, [keyGroups, scope.projectId, scope.environmentId]);

  const regenerate = useMutation({
    ...regenerateKeyMutation(scope.workspaceId),
    onSuccess: (key: MintedKey) => {
      setMinted((prev) => ({ ...prev, [key.environment]: key.plaintextValue }));
      qc.invalidateQueries({
        queryKey: platformKeys.apiKeys(scope.workspaceId, key.environment),
      });
      toast.success("Key created. Copy it now — it is not shown again.");
    },
    onError: () => toast.error("Failed to create the key"),
  });

  // Statuses for every environment need each environment's keys, and the query
  // above only fetched the current one's. Rather than a query per environment,
  // the list is derived from what is known and the others are marked unknown
  // until selected — the promote step tells you what it did when it mints.
  const environmentStatuses: EnvironmentStatus[] = environments.map((env) => {
    const isCurrent = env.id === scope.environmentId;
    const key = isCurrent ? currentKey : undefined;
    return {
      id: env.id,
      name: env.name,
      hasKey: Boolean(key) || Boolean(minted[env.id]),
      prefix: key?.prefix ?? "",
      isCurrent,
    };
  });

  return {
    scope,
    project,
    environment,
    environments,
    environmentStatuses,
    isReady,
    isLoading: keysLoading,

    /** The prefix of the existing key, safe to display. */
    keyPrefix: currentKey?.prefix ?? "",
    hasKey: Boolean(currentKey),

    /** Plaintext for keys minted in this session, by environment id. */
    minted,

    createKey: (environmentId: string) => {
      if (!scope.projectId || !environmentId) return;
      regenerate.mutate({ projectId: scope.projectId, environmentId });
    },
    isCreatingKey: regenerate.isPending,

    eventCount: events.length,
    isReceiving: events.length > 0,
    isCheckingEvents: eventsLoading,
    lastEventAt: events[0]?.receivedAt ?? "",
  };
}
