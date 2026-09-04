import { Box, Textarea } from "@operonstudio/ui";
import { useRef, useState } from "react";
import type { ContextVariable } from "#/common/api/types";
import * as classes from "../style";

interface PropertiesEditorProps {
  value: string;
  onChange: (next: string) => void;
  variables: ContextVariable[];
}

/** An open `{{` before the cursor, with whatever has been typed since. */
interface ActiveReference {
  /** Index of the `{{` that opened it. */
  start: number;
  query: string;
}

/**
 * Finds the reference being typed at the cursor.
 *
 * Only an unclosed `{{` counts: once `}}` has been typed the reference is
 * finished and the list should not reappear while editing text after it.
 */
function activeReferenceAt(
  text: string,
  cursor: number,
): ActiveReference | null {
  const open = text.lastIndexOf("{{", cursor - 1);
  if (open === -1) return null;

  const between = text.slice(open + 2, cursor);
  if (between.includes("}}") || between.includes("{{")) return null;
  // A newline means they moved on and left the braces behind.
  if (/[\n]/.test(between)) return null;

  return { start: open, query: between.trim() };
}

/**
 * The properties field, with completion for context variables.
 *
 * Typing `{{` offers the variables in scope. This replaced a row of chips that
 * appended a new key to the JSON: that inserted at the end rather than where
 * the cursor was, so it could not be used to fill in a value in a key someone
 * had already written.
 */
export const PropertiesEditor = ({
  value,
  onChange,
  variables,
}: PropertiesEditorProps) => {
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [reference, setReference] = useState<ActiveReference | null>(null);
  const [highlighted, setHighlighted] = useState(0);

  const matches = reference
    ? variables.filter((v) =>
        v.name.toLowerCase().startsWith(reference.query.toLowerCase()),
      )
    : [];

  // Clamped during render rather than reset from an effect. The list shrinks as
  // the query narrows, and an effect would leave the highlight briefly pointing
  // past the end on the frame before it ran.
  const active =
    matches.length === 0 ? 0 : Math.min(highlighted, matches.length - 1);

  const syncReference = () => {
    const area = areaRef.current;
    if (!area) return;
    setReference(activeReferenceAt(area.value, area.selectionStart ?? 0));
  };

  const complete = (name: string) => {
    const area = areaRef.current;
    if (!area || !reference) return;

    const cursor = area.selectionStart ?? 0;
    const before = value.slice(0, reference.start);
    const after = value.slice(cursor);
    const inserted = `{{ ${name} }}`;

    onChange(`${before}${inserted}${after}`);
    setReference(null);

    // Put the cursor after the completed reference rather than at the end,
    // so typing can continue where it left off.
    const caret = before.length + inserted.length;
    requestAnimationFrame(() => {
      area.focus();
      area.setSelectionRange(caret, caret);
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (matches.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted(
        (i) => (Math.min(i, matches.length - 1) + 1) % matches.length,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted(
        (i) =>
          (Math.min(i, matches.length - 1) - 1 + matches.length) %
          matches.length,
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      complete(matches[active].name);
    } else if (e.key === "Escape") {
      setReference(null);
    }
  };

  return (
    <Box {...classes.propertiesWrapStyle}>
      <Textarea
        id="event-properties"
        ref={areaRef}
        value={value}
        rows={6}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          onChange(e.target.value);
          // After the value lands, so the cursor position is current.
          requestAnimationFrame(syncReference);
        }}
        onKeyUp={syncReference}
        onClick={syncReference}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => setReference(null), 120)}
        style={{
          resize: "vertical",
          fontFamily: "var(--operon-typography-mono)",
          fontSize: "12px",
        }}
      />

      {matches.length > 0 && (
        <Box {...classes.completionStyle}>
          {matches.map((variable, index) => (
            <button
              key={variable.id}
              type="button"
              // Mouse down rather than click: blur fires first otherwise and
              // closes the list before the selection registers.
              onMouseDown={(e) => {
                e.preventDefault();
                complete(variable.name);
              }}
              onMouseEnter={() => setHighlighted(index)}
              {...classes.completionItemStyle}
              style={{
                backgroundColor:
                  index === active
                    ? "var(--operon-color-primary-ghost)"
                    : undefined,
              }}
            >
              <span {...classes.completionNameStyle}>{variable.name}</span>
              <span {...classes.completionTypeStyle}>{variable.type}</span>
            </button>
          ))}
        </Box>
      )}

      {reference && matches.length === 0 && variables.length > 0 && (
        <Box {...classes.completionEmptyStyle}>
          No context variable starts with “{reference.query}”.
        </Box>
      )}
    </Box>
  );
};
