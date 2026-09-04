import type { ContextVariable } from "./types";

/**
 * `{{ name }}` references inside an event's properties.
 *
 * A developer registers context variables once, at SDK init. Someone who does
 * not write code then references them here, and the SDK substitutes the live
 * value at the moment the event fires. That split is the point of the product:
 * the values stay in the app, the decision about what to send does not.
 */
const REFERENCE = /\{\{\s*([\w.]+)\s*\}\}/g;

/** The same reference including the quotes that usually surround it. */
const QUOTED_REFERENCE = /"\s*\{\{\s*[\w.]+\s*\}\}\s*"/g;

/** Every variable name referenced in the text, in order, without duplicates. */
export function referencedVariables(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(REFERENCE)) {
    found.add(match[1]);
  }
  return [...found];
}

export interface PropertiesCheck {
  /** Parse or reference problems, in the order a reader would hit them. */
  errors: string[];
  /** References that resolve against the declared context variables. */
  resolved: string[];
  /** References with no matching context variable. */
  unknown: string[];
}

/**
 * Validates the properties JSON and its references.
 *
 * References are checked against the declared variables, because a typo like
 * `{{ userID }}` for `userId` is otherwise invisible until it reaches the
 * analytics destination as a literal string, days later.
 */
export function checkProperties(
  text: string,
  variables: ContextVariable[],
): PropertiesCheck {
  const errors: string[] = [];
  const trimmed = text.trim();

  if (trimmed !== "") {
    // A reference usually sits inside quotes, as `"user": "{{ userId }}"`, so
    // it has to be swapped together with them or the result is double-quoted
    // and fails to parse. A bare reference, `"count": {{ n }}`, stands in for a
    // raw value and becomes a literal instead.
    const parseable = text
      .replace(QUOTED_REFERENCE, '"__operon_ref__"')
      .replace(REFERENCE, "null");
    try {
      const parsed = JSON.parse(parseable);
      if (
        parsed === null ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        errors.push("Properties must be a JSON object.");
      }
    } catch {
      errors.push("This is not valid JSON.");
    }
  }

  const declared = new Set(variables.map((v) => v.name));
  const referenced = referencedVariables(text);
  const resolved = referenced.filter((name) => declared.has(name));
  const unknown = referenced.filter((name) => !declared.has(name));

  for (const name of unknown) {
    errors.push(`No context variable called "${name}".`);
  }

  return { errors, resolved, unknown };
}

/**
 * Substitutes values into the text, the way the SDK will at fire time.
 *
 * Used for the preview in the console so the author can see what actually goes
 * out rather than reasoning about it.
 */
export function interpolate(
  text: string,
  values: Record<string, unknown>,
): string {
  return text.replace(REFERENCE, (_whole, name: string) => {
    const value = values[name];
    if (value === undefined) return `{{ ${name} }}`;
    return typeof value === "string" ? value : JSON.stringify(value);
  });
}

/** A plausible value per type, for the preview. */
export function sampleValue(variable: ContextVariable): unknown {
  switch (variable.type) {
    case "number":
      return 42;
    case "boolean":
      return true;
    default:
      return `<${variable.name}>`;
  }
}
