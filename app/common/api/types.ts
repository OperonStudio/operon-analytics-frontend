/**
 * How a bound event fires.
 *
 * These are all element-level: each one needs something on the page to happen
 * to. Page-level things like a route change or the tab being hidden have no
 * element, so they are a separate concept rather than entries here. Putting
 * them in this list would mean every such tracker had to be bound to an
 * arbitrary element that had nothing to do with it.
 */
export type Trigger =
  | "click"
  | "form_submit"
  | "change"
  | "visible"
  | "hover"
  | "focus";

/** What an element must be able to do for a trigger to fire on it. */
export interface ElementCapabilities {
  isForm?: boolean;
  inForm?: boolean;
  takesInput?: boolean;
  focusable?: boolean;
  inputType?: string;
}

export interface TriggerDefinition {
  value: Trigger;
  label: string;
  hint: string;
  /** Shown in the picker to explain when this is the right choice. */
  detail?: string;
  /**
   * Whether this trigger can fire on the given element, and why not.
   *
   * Binding "value changes" to a paragraph produces a tracker that silently
   * never fires, and the only way to find out was to ship it and wait for data
   * that never arrived.
   */
  appliesTo?: (capabilities: ElementCapabilities) => string | null;
}

export const TRIGGERS: TriggerDefinition[] = [
  {
    value: "click",
    label: "Click",
    hint: "someone clicks it",
    detail: "The default. Buttons, links, cards.",
  },
  {
    value: "form_submit",
    label: "Form submit",
    hint: "its form is submitted",
    detail: "Fires on the form, so a keyboard submit counts too.",
    appliesTo: (c) =>
      c.isForm || c.inForm
        ? null
        : "Only a form, or something inside one, can be submitted.",
  },
  {
    value: "change",
    label: "Value changes",
    hint: "its value changes",
    detail: "Selects, checkboxes, radios and text inputs.",
    appliesTo: (c) =>
      c.takesInput ? null : "Only an input, select or textarea has a value.",
  },
  {
    value: "visible",
    label: "Becomes visible",
    hint: "it scrolls into view",
    detail: "Impressions. Did anyone actually see this?",
  },
  {
    value: "hover",
    label: "Hover",
    hint: "the pointer rests on it",
    detail: "Needs a dwell time, or every passing cursor fires it.",
  },
  {
    value: "focus",
    label: "Focus",
    hint: "it receives focus",
    detail: "Where people start in a form, and where they abandon it.",
    appliesTo: (c) =>
      c.focusable ? null : "This element cannot receive keyboard focus.",
  },
];

/**
 * The triggers that can fire on a given element, each with a reason when it
 * cannot.
 *
 * Capabilities are absent until the SDK reports them, in which case everything
 * is offered rather than nothing.
 */
export function triggersFor(
  capabilities: ElementCapabilities | undefined,
): { definition: TriggerDefinition; unavailableReason: string | null }[] {
  return TRIGGERS.map((definition) => ({
    definition,
    unavailableReason:
      capabilities && definition.appliesTo
        ? definition.appliesTo(capabilities)
        : null,
  }));
}

/**
 * Per-trigger settings.
 *
 * Plain hover and bare visibility are close to useless as signals: a cursor
 * crossing an element, or one pixel of it entering the viewport, is not intent.
 * The thresholds are what make them mean something.
 */
export interface TriggerConfig {
  /** visible: how much of it must be on screen, as a percentage. */
  thresholdPercent?: number;
  /** visible: for how long, before it counts. */
  minDurationMs?: number;
  /** hover: how long the pointer must rest before it counts. */
  dwellMs?: number;
}

export const DEFAULT_TRIGGER_CONFIG: Record<Trigger, TriggerConfig> = {
  click: {},
  form_submit: {},
  change: {},
  focus: {},
  visible: { thresholdPercent: 50, minDurationMs: 1000 },
  hover: { dwellMs: 1000 },
};

/**
 * One element bound to an event.
 *
 * This is the single record the whole product turns on: a developer marks an
 * element with a tracking attribute, and someone who does not write code says
 * what firing on it means. The visual editor creates these and the trackers
 * page lists them, so they are one type rather than two that drift.
 */
export interface Tracker {
  id: string;
  workspaceId: string;
  projectId: string;
  environmentId: string;
  /** Value of the tracking attribute on the developer's element. */
  operonId: string;
  /** The name the analytics destination receives. */
  eventName: string;
  trigger: Trigger;
  /** Thresholds for the triggers that need them. */
  triggerConfig?: TriggerConfig;
  /**
   * Extra properties sent with the event, as a JSON string.
   *
   * May reference a context variable with `{{ name }}`, resolved by the SDK at
   * the moment the event fires.
   */
  properties: string;
  enabled: boolean;
  /** Page the element was bound on, for context in the list. */
  sourceUrl?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  /** Counted by the backend from the events this tracker actually produced. */
  firedCount?: number;
  lastFiredAt?: string;
}

/**
 * What the console sends when creating or updating a tracker.
 *
 * The workspace, project and environment are not in here: the server takes
 * them from the URL, so accepting them in the body would be a second place to
 * say the same thing and a way for the two to disagree.
 */
export type TrackerInput = Pick<
  Tracker,
  "operonId" | "eventName" | "trigger" | "properties" | "enabled"
> &
  Partial<Pick<Tracker, "id" | "triggerConfig" | "sourceUrl">>;

/** One event the SDK reported. */
export interface AnalyticsEvent {
  id: string;
  trackerId?: string;
  eventName: string;
  operonId: string;
  trigger: Trigger;
  url: string;
  properties: Record<string, unknown> | null;
  /** Groups one browser's events without identifying anyone. */
  anonymousId?: string;
  receivedAt: string;
}

/** A workspace-level variable a rule or property can reference. */
export interface ContextVariable {
  id: string;
  workspaceId?: string;
  name: string;
  type: "string" | "number" | "boolean";
  description?: string;
}

export interface OverviewPoint {
  date: string;
  count: number;
}

export interface Overview {
  totalEvents: number;
  activeTrackers: number;
  uniqueVisitors: number;
  daily: OverviewPoint[];
  topEvents: { eventName: string; count: number }[];
}

// ── Scope ───────────────────────────────────────────────────────────────────
//
// The platform owns these records and every product shares them. Analytics
// reads and writes them through operon-homepage-backend, so a workspace created
// from this console is the same one Compose sees. Only the fields this console
// uses are declared, so a change to the rest of a project cannot break this
// build.

export interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description?: string | null;
  /**
   * Which consoles this project is set up for. Absent on projects created
   * before the field existed, which means every product rather than none.
   */
  products?: string[];
}

export interface Environment {
  id: string;
  name: string;
}
