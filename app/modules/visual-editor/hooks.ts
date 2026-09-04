import { toast } from "@operonstudio/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  deleteTrackerMutation,
  saveTrackerMutation,
  trackersQuery,
} from "#/common/api/queries";
import { queryKeys } from "#/common/api/query-keys";
import { useScope } from "#/common/scope";
import { FROM_PAGE, parseMessage, postToPage, TO_PAGE } from "./bridge";
import type {
  Binding,
  ConnectionState,
  DiscoveredElement,
  Trigger,
  Visibility,
} from "./types";

const CONNECT_TIMEOUT_MS = 4000;

/**
 * Collapses a report to one entry per id.
 *
 * An id is a binding target, not a DOM node: a list of five cards carries the
 * same id five times and one tracker covers all of them. Reporting each node
 * produced five identical rows keyed on the same value, which React renders
 * unpredictably, and the list appeared to grow on every navigation.
 */
function distinct(reported: DiscoveredElement[]): DiscoveredElement[] {
  const byId = new Map<string, DiscoveredElement>();
  for (const element of reported) {
    if (!element.operonId) continue;
    const existing = byId.get(element.operonId);
    if (!existing) {
      byId.set(element.operonId, { ...element, count: element.count ?? 1 });
      continue;
    }
    existing.count = (existing.count ?? 1) + (element.count ?? 1);
    // Prefer an occurrence that is actually on screen, so selecting the row
    // highlights something the user can see.
    if (!existing.visible && element.visible) {
      byId.set(element.operonId, { ...element, count: existing.count });
    }
  }
  return [...byId.values()];
}

/**
 * Owns the conversation with the page being edited.
 *
 * All of this used to live inside one component in the design system, which
 * meant the editor could not be worked on without publishing a package, and the
 * protocol handling sat next to the markup.
 */
export function useVisualEditor(initialUrl: string) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  const [url, setUrl] = useState(initialUrl);
  const [draftUrl, setDraftUrl] = useState(initialUrl);
  const [connection, setConnection] = useState<ConnectionState>(
    initialUrl ? "loading" : "idle",
  );
  const [isInspecting, setIsInspecting] = useState(false);
  const [elements, setElements] = useState<DiscoveredElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility | null>(null);
  const [search, setSearch] = useState("");

  // Bindings are trackers. They used to be component state that vanished on
  // reload and had nothing to do with the trackers page, which listed its own
  // unrelated fixtures.
  const queryClient = useQueryClient();
  const { scope, isReady: isScopeReady } = useScope();
  const { data: trackers = [] } = useQuery(trackersQuery(scope));

  const invalidateTrackers = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.trackers(scope) });

  const saveTracker = useMutation({
    ...saveTrackerMutation(scope),
    onSuccess: invalidateTrackers,
  });
  const removeTracker = useMutation({
    ...deleteTrackerMutation(scope),
    onSuccess: invalidateTrackers,
  });

  const bindings = useMemo(
    () =>
      Object.fromEntries(
        trackers.map((tracker) => [
          tracker.operonId,
          {
            operonId: tracker.operonId,
            eventName: tracker.eventName,
            trigger: tracker.trigger,
            triggerConfig: tracker.triggerConfig,
            properties: tracker.properties,
          } satisfies Binding,
        ]),
      ),
    [trackers],
  );

  const send = useCallback(
    (type: string, payload?: unknown) =>
      postToPage(frameRef.current, url, type, payload),
    [url],
  );

  const stopInspecting = useCallback(() => {
    setIsInspecting(false);
    send(TO_PAGE.stopInspect);
  }, [send]);

  const toggleInspecting = useCallback(() => {
    setIsInspecting((wasInspecting) => {
      send(wasInspecting ? TO_PAGE.stopInspect : TO_PAGE.startInspect);
      return !wasInspecting;
    });
  }, [send]);

  const select = useCallback(
    (operonId: string) => {
      setSelectedId(operonId);
      setVisibility(null);
      // The page scrolls it into view and reports back whether it could. That
      // report is the difference between "nothing happened" and "this lives in
      // a modal you have not opened".
      send(TO_PAGE.highlight, operonId);
    },
    [send],
  );

  // Read inside the message handler, which must not be re-bound on every
  // selection change.
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  // Messages from the SDK inside the page.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const message = parseMessage(event.data);
      if (!message) return;

      switch (message.type) {
        case FROM_PAGE.ready:
          // The SDK announces itself on load. Waiting for an element report
          // meant the Inspect button stayed disabled until inspect mode had
          // already been started some other way.
          setConnection("connected");
          break;
        case FROM_PAGE.reportElements:
          setElements(distinct(message.payload));
          setConnection("connected");
          break;
        case FROM_PAGE.elementSelected:
          setVisibility("visible");
          setElements((current) =>
            current.some((e) => e.operonId === message.payload.operonId)
              ? current
              : [...current, message.payload],
          );
          setSelectedId(message.payload.operonId);
          setConnection("connected");
          break;
        case FROM_PAGE.elementVisibility:
          if (message.payload.operonId === selectedIdRef.current) {
            setVisibility(message.payload.visibility);
          }
          break;
        case FROM_PAGE.keyboardShortcut:
          if (message.payload === "TOGGLE_EDIT") toggleInspecting();
          if (message.payload === "ESCAPE") stopInspecting();
          break;
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [toggleInspecting, stopInspecting]);

  // Shortcuts pressed while focus is in the editor rather than the page.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
        e.preventDefault();
        toggleInspecting();
      }
      if (e.key === "Escape") stopInspecting();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleInspecting, stopInspecting]);

  /**
   * The SDK announces itself by reporting elements. If nothing arrives, the
   * page either has no SDK or refused to frame at all, and saying which is the
   * difference between a five-minute fix and an afternoon.
   */
  useEffect(() => {
    if (connection !== "loading") return;
    const timer = setTimeout(() => {
      setConnection((state) => (state === "loading" ? "no-sdk" : state));
    }, CONNECT_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [connection]);

  const load = (next: string) => {
    const trimmed = next.trim();
    if (!trimmed) return;
    const withScheme = /^https?:\/\//.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    setUrl(withScheme);
    setDraftUrl(withScheme);
    setConnection("loading");
    setElements([]);
    setSelectedId(null);
    setVisibility(null);
    setIsInspecting(false);
  };

  const bind = (operonId: string, binding: Omit<Binding, "operonId">) => {
    saveTracker.mutate(
      { operonId, ...binding, enabled: true, sourceUrl: url },
      {
        onSuccess: () =>
          toast.success(`${binding.eventName} bound to ${operonId}`),
        onError: (error: Error) =>
          toast.error(error.message || "Could not save the binding"),
      },
    );
  };

  const unbind = (operonId: string) => {
    const tracker = trackers.find((t) => t.operonId === operonId);
    if (!tracker) return;
    removeTracker.mutate(tracker.id);
    send(TO_PAGE.reset, { operonId });
  };

  const visibleElements = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return elements;
    return elements.filter(
      (e) =>
        e.operonId.toLowerCase().includes(query) ||
        e.text?.toLowerCase().includes(query),
    );
  }, [elements, search]);

  return {
    frameRef,
    url,
    draftUrl,
    setDraftUrl,
    load,
    connection,
    setConnection,
    isInspecting,
    toggleInspecting,
    elements,
    visibleElements,
    search,
    setSearch,
    selectedId,
    select,
    visibility,
    selected: elements.find((e) => e.operonId === selectedId) ?? null,
    bindings,
    bind,
    unbind,
    isSaving: saveTracker.isPending,
    boundCount: trackers.length,
    isScopeReady,
  };
}

export type VisualEditor = ReturnType<typeof useVisualEditor>;
export type { Binding, DiscoveredElement, Trigger };
