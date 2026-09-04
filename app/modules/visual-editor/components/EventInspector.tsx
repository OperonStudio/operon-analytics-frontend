import { Trash2 } from "@operonstudio/icons";
import { Box, Button, Dropdown, Input, toast } from "@operonstudio/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  checkProperties,
  interpolate,
  sampleValue,
} from "#/common/api/interpolation";
import { contextVariablesQuery } from "#/common/api/queries";
import { triggersFor } from "#/common/api/types";
import { useScope } from "#/common/scope";
import type { VisualEditor } from "../hooks";
import * as classes from "../style";
import {
  DEFAULT_TRIGGER_CONFIG,
  TRIGGERS,
  type Trigger,
  type TriggerConfig,
} from "../types";
import { PropertiesEditor } from "./PropertiesEditor";

/**
 * Binds the selected element to an event.
 *
 * This is the whole point of the product: the developer adds a tracking
 * attribute once, and this pane is where someone who does not write code
 * decides what firing on it means.
 */
export const EventInspector = ({ editor }: { editor: VisualEditor }) => {
  const selected = editor.selected;
  const existing = selected ? editor.bindings[selected.operonId] : undefined;

  const [eventName, setEventName] = useState("");
  const [trigger, setTrigger] = useState<Trigger>("click");
  const [triggerConfig, setTriggerConfig] = useState<TriggerConfig>({});
  const [properties, setProperties] = useState("{}");

  const { scope } = useScope();
  const { data: variables = [] } = useQuery(
    contextVariablesQuery(scope.workspaceId),
  );

  // Reference errors are worth catching here: a typo like {{ userID }} for
  // userId reaches the analytics destination as a literal string, and is only
  // noticed days later when the data is wrong.
  // The SDK reports what the element can do, so a trigger that could never
  // fire on it is never offered.
  const triggerOptions = useMemo(
    () => triggersFor(selected?.capabilities),
    [selected?.capabilities],
  );
  const available = triggerOptions.filter((t) => !t.unavailableReason);
  const unavailable = triggerOptions.filter((t) => t.unavailableReason);

  const check = useMemo(
    () => checkProperties(properties, variables),
    [properties, variables],
  );

  const preview = useMemo(() => {
    if (check.resolved.length === 0) return null;
    const values = Object.fromEntries(
      variables.map((v) => [v.name, sampleValue(v)]),
    );
    return interpolate(properties, values);
  }, [properties, variables, check.resolved.length]);

  // Re-seed when the selection changes, so the pane always describes the
  // element that is actually selected.
  useEffect(() => {
    setEventName(existing?.eventName ?? "");
    const nextTrigger = existing?.trigger ?? "click";
    setTrigger(nextTrigger);
    setTriggerConfig(
      existing?.triggerConfig ?? DEFAULT_TRIGGER_CONFIG[nextTrigger],
    );
    setProperties(existing?.properties ?? "{}");
  }, [existing]);

  if (!selected) {
    return (
      <Box {...classes.panelStyle}>
        <Box {...classes.panelHeaderStyle}>
          <span>Event</span>
        </Box>
        <Box {...classes.inspectorEmptyStyle}>
          Pick an element on the left, or turn on Inspect and click one in the
          page.
        </Box>
      </Box>
    );
  }

  const save = () => {
    const name = eventName.trim();
    if (!name) {
      toast.error("Give the event a name");
      return;
    }
    if (check.errors.length > 0) {
      toast.error(check.errors[0]);
      return;
    }
    editor.bind(selected.operonId, {
      eventName: name,
      trigger,
      triggerConfig,
      properties,
    });
  };

  return (
    <Box {...classes.panelStyle}>
      <Box {...classes.panelHeaderStyle}>
        <span>Event</span>
        {existing && <span {...classes.boundBadgeStyle}>bound</span>}
      </Box>

      {/* Clicking a row and seeing nothing move is the most confusing thing
          this editor can do. The page reports back why. */}
      {editor.visibility === "hidden" && (
        <Box {...classes.noticeStyle}>
          This element is on the page but not visible right now. It may be
          inside a modal, tab or menu that is closed. You can still bind an
          event to it.
        </Box>
      )}
      {editor.visibility === "missing" && (
        <Box {...classes.noticeStyle}>
          This element is no longer on the page. It may render only in a
          different state, or its tracking attribute may have been removed.
        </Box>
      )}

      <Box {...classes.inspectorStyle}>
        <Box>
          <Box {...classes.fieldLabelStyle}>Element</Box>
          <Box {...classes.targetStyle}>{selected.operonId}</Box>
          {selected.text && (
            <Box {...classes.targetTextStyle}>“{selected.text}”</Box>
          )}
        </Box>

        <Box>
          <label {...classes.fieldLabelStyle} htmlFor="event-name">
            Event name
          </label>
          <Input
            id="event-name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="checkout_started"
            fullWidth
          />
          <Box {...classes.fieldHintStyle}>
            This is the name your analytics tool receives.
          </Box>
        </Box>

        <Box>
          <Box {...classes.fieldLabelStyle} id="trigger-label">
            Fires on
          </Box>
          <Dropdown
            onSelect={(value) => {
              const next = value as Trigger;
              setTrigger(next);
              setTriggerConfig(DEFAULT_TRIGGER_CONFIG[next]);
            }}
            containerStyle={{ width: "100%" }}
            items={available.map((t) => ({
              value: t.definition.value,
              label: t.definition.label,
            }))}
            trigger={
              <Button
                variant="outline"
                aria-labelledby="trigger-label"
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                {TRIGGERS.find((t) => t.value === trigger)?.label}
              </Button>
            }
          />
          <Box {...classes.fieldHintStyle}>
            Fires when {TRIGGERS.find((t) => t.value === trigger)?.hint}.{" "}
            {TRIGGERS.find((t) => t.value === trigger)?.detail}
          </Box>

          {/* Naming what is missing is more useful than quietly offering fewer
              options, which reads as the picker being broken. */}
          {unavailable.length > 0 && (
            <Box {...classes.unavailableStyle}>
              Not available on a &lt;{selected.tag}&gt;:{" "}
              {unavailable
                .map((t) => t.definition.label.toLowerCase())
                .join(", ")}
              .
            </Box>
          )}

          <TriggerSettings
            trigger={trigger}
            config={triggerConfig}
            onChange={setTriggerConfig}
          />
        </Box>

        <Box>
          <label {...classes.fieldLabelStyle} htmlFor="event-properties">
            Properties
          </label>
          <PropertiesEditor
            value={properties}
            onChange={setProperties}
            variables={variables}
          />

          {check.errors.length > 0 ? (
            <Box {...classes.fieldErrorStyle}>{check.errors[0]}</Box>
          ) : (
            <Box {...classes.fieldHintStyle}>
              Sent alongside the event. Reference a context variable with{" "}
              <code>{"{{ userId }}"}</code>.
            </Box>
          )}

          {/* What actually goes out, with sample values substituted, so the
              author is not reasoning about the result in their head. */}
          {preview && (
            <Box {...classes.previewStyle}>
              <Box {...classes.previewLabelStyle}>Sends</Box>
              {preview}
            </Box>
          )}
        </Box>

        <Box {...classes.inspectorActionsStyle}>
          {existing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.unbind(selected.operonId)}
              style={{ color: "var(--operon-color-danger)", gap: 6 }}
            >
              <Trash2 size={14} /> Remove
            </Button>
          )}
          <Button
            size="sm"
            onClick={save}
            disabled={check.errors.length > 0 || editor.isSaving}
          >
            {existing ? "Update" : "Bind event"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Thresholds for the triggers that need them.
 *
 * A bare hover or one pixel of an element entering the viewport is not intent,
 * so these are what make those two triggers worth having at all.
 */
function TriggerSettings({
  trigger,
  config,
  onChange,
}: {
  trigger: Trigger;
  config: TriggerConfig;
  onChange: (next: TriggerConfig) => void;
}) {
  const set = (patch: Partial<TriggerConfig>) =>
    onChange({ ...config, ...patch });

  const numeric = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  if (trigger === "visible") {
    return (
      <Box {...classes.settingsRowStyle}>
        <Box {...classes.settingStyle}>
          <label {...classes.settingLabelStyle} htmlFor="visible-threshold">
            At least
          </label>
          <Input
            id="visible-threshold"
            type="number"
            min={1}
            max={100}
            value={String(config.thresholdPercent ?? 50)}
            onChange={(e) => set({ thresholdPercent: numeric(e.target.value) })}
          />
          <Box {...classes.settingSuffixStyle}>% on screen</Box>
        </Box>
        <Box {...classes.settingStyle}>
          <label {...classes.settingLabelStyle} htmlFor="visible-duration">
            For
          </label>
          <Input
            id="visible-duration"
            type="number"
            min={0}
            step={100}
            value={String(config.minDurationMs ?? 1000)}
            onChange={(e) => set({ minDurationMs: numeric(e.target.value) })}
          />
          <Box {...classes.settingSuffixStyle}>ms</Box>
        </Box>
      </Box>
    );
  }

  if (trigger === "hover") {
    return (
      <Box {...classes.settingsRowStyle}>
        <Box {...classes.settingStyle}>
          <label {...classes.settingLabelStyle} htmlFor="hover-dwell">
            Rests for
          </label>
          <Input
            id="hover-dwell"
            type="number"
            min={0}
            step={100}
            value={String(config.dwellMs ?? 1000)}
            onChange={(e) => set({ dwellMs: numeric(e.target.value) })}
          />
          <Box {...classes.settingSuffixStyle}>ms</Box>
        </Box>
      </Box>
    );
  }

  return null;
}
