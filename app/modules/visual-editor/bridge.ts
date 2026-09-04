import type { DiscoveredElement, Visibility } from "./types";

/**
 * The postMessage protocol between this editor and the Operon SDK running
 * inside the customer's page.
 *
 * The names were previously loose strings scattered across the component and
 * the SDK, so a rename on one side failed silently on the other. Declaring them
 * once, typed, means a mismatch is a compile error here and a single place to
 * check against the SDK.
 */
export const TO_PAGE = {
  startInspect: "OPERON_START_INSPECT",
  stopInspect: "OPERON_STOP_INSPECT",
  highlight: "OPERON_HIGHLIGHT_ELEMENT",
  preview: "OPERON_PREVIEW_ELEMENT",
  reset: "OPERON_RESET_ELEMENT",
} as const;

export const FROM_PAGE = {
  elementSelected: "OPERON_ELEMENT_SELECTED",
  reportElements: "OPERON_REPORT_ELEMENTS",
  keyboardShortcut: "OPERON_KEYBOARD_SHORTCUT",
  /** Whether the element the editor asked to reveal could actually be shown. */
  elementVisibility: "OPERON_ELEMENT_VISIBILITY",
  /** Sent once, as soon as the SDK loads, so the editor knows it is there. */
  ready: "OPERON_READY",
} as const;

export type FromPageMessage =
  | { type: typeof FROM_PAGE.elementSelected; payload: DiscoveredElement }
  | { type: typeof FROM_PAGE.reportElements; payload: DiscoveredElement[] }
  | {
      type: typeof FROM_PAGE.keyboardShortcut;
      payload: "TOGGLE_EDIT" | "ESCAPE";
    }
  | {
      type: typeof FROM_PAGE.elementVisibility;
      payload: { operonId: string; visibility: Visibility };
    }
  | { type: typeof FROM_PAGE.ready; payload: { attribute?: string } };

/** Narrows an arbitrary message event to one the SDK sent. */
export function parseMessage(data: unknown): FromPageMessage | null {
  if (!data || typeof data !== "object") return null;
  const message = data as { type?: unknown };
  switch (message.type) {
    case FROM_PAGE.elementSelected:
    case FROM_PAGE.reportElements:
    case FROM_PAGE.keyboardShortcut:
    case FROM_PAGE.elementVisibility:
    case FROM_PAGE.ready:
      return data as FromPageMessage;
    default:
      return null;
  }
}

/**
 * Sends a message into the page.
 *
 * The target origin is derived from the page's own URL rather than `"*"`, so a
 * message meant for the customer's site is not delivered to whatever else might
 * be framed there.
 */
export function postToPage(
  frame: HTMLIFrameElement | null,
  url: string,
  type: string,
  payload?: unknown,
): void {
  const target = frame?.contentWindow;
  if (!target) return;

  let origin = "*";
  try {
    origin = new URL(url).origin;
  } catch {
    // An unparseable URL means nothing is loaded yet; there is nothing to
    // message, so leaving origin as "*" is harmless.
  }
  target.postMessage(
    payload === undefined ? { type } : { type, payload },
    origin,
  );
}
