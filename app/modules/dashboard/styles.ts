import { css } from "@morph-css/kit";

/**
 * Dashboard styling.
 *
 * Deliberately restrained: one accent colour (the primary token), one type
 * scale, tabular figures, and a 1px rule doing the work that a drop shadow
 * would otherwise do. The console is a working surface, so density and
 * legibility beat decoration.
 */

// ── Page ────────────────────────────────────────────────────────────────────

export const pageStyle = css({
  padding: "28px 40px 64px",
  maxWidth: "1180px",
  margin: "0 auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  minHeight: "100%",
  "@media (max-width: 768px)": {
    padding: "20px 16px 48px",
  },
});

export const headerStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "16px",
  flexWrap: "wrap",
});

export const headerTextStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  minWidth: 0,
});

/** Workspace and environment, shown as a path rather than a sentence. */
export const scopeStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "12px",
  fontFamily: "var(--operon-typography-mono)",
  color: "var(--operon-color-text-muted)",
  minWidth: 0,
});

export const scopeSeparatorStyle = css({
  color: "var(--operon-color-border-strong)",
});

export const scopeEnvStyle = css({
  color: "var(--operon-color-text)",
});

export const titleStyle = css({
  fontSize: "20px",
  fontWeight: 600,
  letterSpacing: "-0.01em",
  color: "var(--operon-color-text-strong)",
  lineHeight: 1.2,
});

// ── Metric strip ────────────────────────────────────────────────────────────

/**
 * The headline figures, sharing one bordered container and divided by hairlines
 * rather than floated as separate cards, so they read as one set of related
 * numbers.
 *
 * The track count follows the number of figures rather than being fixed at
 * four, which left a lit but empty fourth cell on the right of a strip that
 * only ever renders three.
 */
export const metricsStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  // A 1px gap over a border-coloured ground draws the hairlines between cells,
  // so the dividers stay correct when the grid rewraps to two columns without
  // needing nth-child rules per breakpoint.
  gap: "1px",
  backgroundColor: "var(--operon-color-border-subtle)",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-md)",
  overflow: "hidden",
  "@media (max-width: 720px)": {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
});

export const metricStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  padding: "16px 20px",
  backgroundColor: "var(--operon-color-surface)",
});

export const metricLabelStyle = css({
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "var(--operon-color-text-muted)",
});

export const metricValueStyle = css({
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  color: "var(--operon-color-text-strong)",
  fontVariantNumeric: "tabular-nums",
});

export const metricNoteStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-subtle)",
  fontVariantNumeric: "tabular-nums",
});

// ── Panels ──────────────────────────────────────────────────────────────────

export const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
  gap: "20px",
  alignItems: "start",
  "@media (max-width: 900px)": {
    gridTemplateColumns: "1fr",
  },
});

export const panelStyle = css({
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-md)",
  backgroundColor: "var(--operon-color-surface)",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

export const panelHeaderStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: "12px",
  padding: "14px 20px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
});

export const panelTitleStyle = css({
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
});

export const panelMetaStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-muted)",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
});

export const panelBodyStyle = css({
  padding: "20px",
});

// ── Traffic chart ───────────────────────────────────────────────────────────

/**
 * Laid out as flex rather than grid: an earlier grid version placed the weekday
 * labels back in the axis gutter instead of under the plot.
 */
export const chartStyle = css({
  display: "flex",
  gap: "12px",
});

/** Peak and zero, pinned to the top and bottom of the plot. */
export const axisStyle = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "160px",
  fontSize: "10px",
  fontFamily: "var(--operon-typography-mono)",
  color: "var(--operon-color-text-subtle)",
  textAlign: "right",
  flexShrink: 0,
});

export const chartMainStyle = css({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
});

/**
 * A solid baseline and a dashed line at the peak give the bars something to be
 * measured against.
 *
 * There is deliberately no filled track behind each day. Filling the full
 * column height made six quiet days read as six tall grey bars, which is the
 * opposite of what the data said.
 */
export const plotStyle = css({
  display: "flex",
  alignItems: "flex-end",
  gap: "6px",
  height: "160px",
  borderBottom: "1px solid var(--operon-color-border)",
  borderTop: "1px dashed var(--operon-color-border-subtle)",
});

export const columnStyle = css({
  flex: 1,
  minWidth: 0,
  height: "100%",
  display: "flex",
  alignItems: "flex-end",
  borderRadius: "2px 2px 0 0",
  transition:
    "background-color var(--operon-motion-fast) var(--operon-motion-easing)",
  "&:hover": {
    backgroundColor: "var(--operon-color-primary-ghost)",
  },
});

export const barStyle = css({
  width: "100%",
  backgroundColor: "var(--operon-color-primary)",
  borderRadius: "2px 2px 0 0",
});

/** A day that was measured and had no traffic, distinct from a missing day. */
export const barEmptyStyle = css({
  width: "100%",
  height: "2px",
  backgroundColor: "var(--operon-color-border-strong)",
  opacity: 0.4,
});

export const chartLabelsStyle = css({
  display: "flex",
  gap: "6px",
  marginTop: "8px",
});

export const chartLabelStyle = css({
  flex: 1,
  minWidth: 0,
  textAlign: "center",
  fontSize: "10px",
  fontFamily: "var(--operon-typography-mono)",
  color: "var(--operon-color-text-subtle)",
});

// ── First-request guide ─────────────────────────────────────────────────────

export const guideStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "14px",
});

export const guideTextStyle = css({
  fontSize: "13px",
  lineHeight: 1.55,
  color: "var(--operon-color-text-muted)",
  maxWidth: "62ch",
});

export const snippetStyle = css({
  position: "relative",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-sm)",
  backgroundColor: "var(--operon-color-surface-sunken)",
  padding: "12px 44px 12px 14px",
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "12px",
  lineHeight: 1.7,
  color: "var(--operon-color-text)",
  whiteSpace: "pre",
  overflowX: "auto",
});

export const snippetCopyStyle = css({
  position: "absolute",
  top: "8px",
  right: "8px",
});

// ── Resource list ───────────────────────────────────────────────────────────

/**
 * Replaces the previous "Workspace Activity" panel, which restated the metric
 * strip as sentences with invented timestamps. This is the same information
 * presented honestly: a directory, and every row goes somewhere.
 */
export const resourceListStyle = css({
  display: "flex",
  flexDirection: "column",
});

export const resourceRowStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "11px 20px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  color: "var(--operon-color-text)",
  textDecoration: "none",
  transition:
    "background-color var(--operon-motion-fast) var(--operon-motion-easing)",
  "&:last-child": {
    borderBottom: "none",
  },
  "&:hover": {
    backgroundColor: "var(--operon-color-surface-sunken)",
  },
});

export const resourceIconStyle = css({
  display: "flex",
  color: "var(--operon-color-text-subtle)",
  flexShrink: 0,
});

export const resourceLabelStyle = css({
  flex: 1,
  fontSize: "13px",
  minWidth: 0,
});

export const resourceCountStyle = css({
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
  fontVariantNumeric: "tabular-nums",
});

export const resourceChevronStyle = css({
  display: "flex",
  color: "var(--operon-color-text-subtle)",
  flexShrink: 0,
});

// ── States ──────────────────────────────────────────────────────────────────

export const errorPanelStyle = css({
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-md)",
  backgroundColor: "var(--operon-color-surface)",
  padding: "32px 24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "10px",
  maxWidth: "520px",
});

export const errorTitleStyle = css({
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
});

export const errorBodyStyle = css({
  fontSize: "13px",
  color: "var(--operon-color-text-muted)",
  lineHeight: 1.55,
});

// ── Top-events list ─────────────────────────────────────────────────────────

export const listStyle = css({
  display: "flex",
  flexDirection: "column",
});

export const listRowStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: "11px 20px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  "&:last-child": { borderBottom: "none" },
});

export const listLabelStyle = css({
  flex: 1,
  minWidth: 0,
  fontSize: "13px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const listCountStyle = css({
  fontSize: "13px",
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
  color: "var(--operon-color-text-strong)",
});

export const listEmptyStyle = css({
  padding: "24px 20px",
  fontSize: "12px",
  color: "var(--operon-color-text-muted)",
});
