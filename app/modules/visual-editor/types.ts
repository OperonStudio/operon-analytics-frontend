// Trigger and its config live in the API types, since the trackers page and
// the SDK contract both need them. Re-exported so the editor's own modules can
// import from one place.
export type {
  ElementCapabilities,
  Trigger,
  TriggerConfig,
} from "#/common/api/types";
export { DEFAULT_TRIGGER_CONFIG, TRIGGERS } from "#/common/api/types";

/**
 * An element the SDK found on the page.
 *
 * `operonId` is the value of the tracking attribute the developer added. It is
 * the contract between their markup and this editor: everything bound here is
 * keyed by it, so the binding survives a redesign as long as the id stays.
 */
export interface DiscoveredElement {
  operonId: string;
  /** The element's tag, so a heading is distinguishable from a button. */
  tag?: string;
  /** A short snippet of its text, which is how a person recognises it. */
  text?: string;
  /**
   * False when the element has no box on screen: inside a closed modal, a
   * collapsed section, or a tab that is not open.
   */
  visible?: boolean;
  /**
   * What the element can do, reported by the SDK. Used to hide triggers that
   * could never fire on it, such as a form submit on a paragraph.
   */
  capabilities?: import("#/common/api/types").ElementCapabilities;
  /**
   * How many nodes on the page carry this id. One binding covers all of them,
   * so this is shown rather than listed as separate rows.
   */
  count?: number;
}

/** What happened when the editor asked the page to reveal an element. */
export type Visibility = "visible" | "hidden" | "missing";

/** One element bound to an event, as the editor holds it. */
export interface Binding {
  operonId: string;
  eventName: string;
  trigger: import("#/common/api/types").Trigger;
  triggerConfig?: import("#/common/api/types").TriggerConfig;
  /** Extra properties sent with the event, as JSON. */
  properties: string;
}

export type ConnectionState =
  | "idle"
  | "loading"
  | "connected"
  | "no-sdk"
  | "blocked";
