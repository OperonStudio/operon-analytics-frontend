import { css } from "@morph-css/kit";

/**
 * Editor chrome, in the shape people already know from a code editor: a
 * toolbar, a list on the left, the thing you are working on in the middle, and
 * properties on the right.
 *
 * Panels are separated by hairlines rather than cards with shadows. The subject
 * is the customer's page, so the chrome around it stays quiet.
 */
export const shellStyle = css({
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr)",
  height: "100vh",
  width: "100%",
  backgroundColor: "var(--operon-color-background)",
  color: "var(--operon-color-text)",
});

// ── Toolbar ─────────────────────────────────────────────────────────────────

export const toolbarStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 14px",
  borderBottom: "1px solid var(--operon-color-border)",
  backgroundColor: "var(--operon-color-surface)",
  flexWrap: "wrap",
});

/** Out of the full-screen editor, which otherwise has no navigation at all. */
export const backLinkStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "5px 10px 5px 7px",
  borderRadius: "var(--operon-radius-sm)",
  border: "1px solid var(--operon-color-border)",
  color: "var(--operon-color-text-muted)",
  textDecoration: "none",
  fontSize: "13px",
  whiteSpace: "nowrap",
  flexShrink: 0,
  transition:
    "background-color var(--operon-motion-fast) var(--operon-motion-easing)",
  "&:hover": {
    backgroundColor: "var(--operon-color-surface-sunken)",
    color: "var(--operon-color-text)",
  },
});

export const urlBarStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flex: 1,
  minWidth: "220px",
  maxWidth: "560px",
});

export const toolbarActionsStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginLeft: "auto",
});

export const boundCountStyle = css({
  fontSize: "12px",
  color: "var(--operon-color-text-muted)",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
});

export const kbdStyle = css({
  marginLeft: "2px",
  padding: "1px 5px",
  borderRadius: "var(--operon-radius-xs)",
  border: "1px solid var(--operon-color-border)",
  fontSize: "10px",
  fontFamily: "var(--operon-typography-mono)",
  opacity: 0.7,
});

// ── Three-pane body ─────────────────────────────────────────────────────────

/** Panels collapse away below 1100px, leaving the page itself. */
export const bodyStyle = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  minHeight: 0,
  "@media (min-width: 1101px)": {
    gridTemplateColumns: "260px minmax(0, 1fr) 320px",
  },
});

export const panelStyle = css({
  display: "none",
  flexDirection: "column",
  minHeight: 0,
  borderRight: "1px solid var(--operon-color-border)",
  backgroundColor: "var(--operon-color-surface)",
  "@media (min-width: 1101px)": {
    display: "flex",
  },
  "&:last-child": {
    borderRight: "none",
    borderLeft: "1px solid var(--operon-color-border)",
  },
});

export const panelHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  padding: "10px 14px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "var(--operon-color-text-muted)",
});

export const panelCountStyle = css({
  fontFamily: "var(--operon-typography-mono)",
  fontVariantNumeric: "tabular-nums",
});

export const boundBadgeStyle = css({
  padding: "1px 7px",
  borderRadius: "var(--operon-radius-full)",
  fontSize: "10px",
  letterSpacing: "0.06em",
  color: "var(--operon-color-success)",
  backgroundColor: "var(--operon-color-success-ghost)",
});

// ── Element tree ────────────────────────────────────────────────────────────

export const searchStyle = css({
  padding: "10px 12px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
});

export const treeStyle = css({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  padding: "6px",
});

/** Layered on Button's ghost variant: a list row, not a chrome button. */
export const treeItemStyle = css({
  "&&": {
    justifyContent: "flex-start",
    gap: "8px",
    height: "auto",
    padding: "7px 8px",
    borderRadius: "var(--operon-radius-sm)",
    fontWeight: 500,
    textAlign: "left",
  },
});

/** Green once an element is bound, so the list doubles as a coverage view. */
export const treeDotStyle = css({
  width: "7px",
  height: "7px",
  borderRadius: "var(--operon-radius-full)",
  flexShrink: 0,
});

export const treeBodyStyle = css({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "1px",
});

export const treeTopStyle = css({
  display: "flex",
  alignItems: "baseline",
  gap: "6px",
  minWidth: 0,
});

export const treeTagStyle = css({
  flexShrink: 0,
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "10px",
  color: "var(--operon-color-text-subtle)",
});

export const treeIdStyle = css({
  flex: 1,
  minWidth: 0,
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "12px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const treeTextStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-muted)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

/** Marks an element with no box on screen, such as one inside a closed modal. */
export const treeHiddenStyle = css({
  flexShrink: 0,
  padding: "1px 6px",
  borderRadius: "var(--operon-radius-full)",
  backgroundColor: "var(--operon-color-warning-ghost)",
  color: "var(--operon-color-warning)",
  fontSize: "10px",
});

export const noticeStyle = css({
  margin: "0 14px 12px",
  padding: "8px 10px",
  borderRadius: "var(--operon-radius-sm)",
  backgroundColor: "var(--operon-color-warning-ghost)",
  color: "var(--operon-color-warning)",
  fontSize: "11px",
  lineHeight: 1.5,
});

export const treeCountStyle = css({
  flexShrink: 0,
  padding: "0 5px",
  borderRadius: "var(--operon-radius-full)",
  backgroundColor: "var(--operon-color-surface-sunken)",
  color: "var(--operon-color-text-subtle)",
  fontSize: "10px",
  fontVariantNumeric: "tabular-nums",
});

export const treeEventStyle = css({
  flexShrink: 0,
  fontSize: "10px",
  color: "var(--operon-color-text-subtle)",
  fontFamily: "var(--operon-typography-mono)",
  maxWidth: "88px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const treeEmptyStyle = css({
  padding: "20px 12px",
  fontSize: "12px",
  lineHeight: 1.55,
  color: "var(--operon-color-text-muted)",
});

// ── Canvas ──────────────────────────────────────────────────────────────────

export const canvasStyle = css({
  position: "relative",
  minHeight: 0,
  backgroundColor: "var(--operon-color-surface-sunken)",
});

export const frameStyle = css({
  width: "100%",
  height: "100%",
  border: "none",
  display: "block",
  backgroundColor: "#ffffff",
});

export const overlayStyle = css({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  backgroundColor: "var(--operon-color-surface-sunken)",
});

export const overlayCardStyle = css({
  maxWidth: "420px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "24px",
  borderRadius: "var(--operon-radius-xl)",
  backgroundColor: "var(--operon-color-surface)",
});

export const overlayIconStyle = css({
  color: "var(--operon-color-text-muted)",
});

export const overlayTitleStyle = css({
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
});

export const overlayBodyStyle = css({
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--operon-color-text-muted)",
});

// ── Inspector ───────────────────────────────────────────────────────────────

export const inspectorStyle = css({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  padding: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const inspectorEmptyStyle = css({
  padding: "20px 14px",
  fontSize: "12px",
  lineHeight: 1.6,
  color: "var(--operon-color-text-muted)",
});

export const fieldLabelStyle = css({
  display: "block",
  marginBottom: "5px",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--operon-color-text)",
});

export const fieldHintStyle = css({
  marginTop: "5px",
  fontSize: "11px",
  lineHeight: 1.5,
  color: "var(--operon-color-text-subtle)",
});

export const targetStyle = css({
  padding: "6px 9px",
  borderRadius: "var(--operon-radius-sm)",
  backgroundColor: "var(--operon-color-surface-sunken)",
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "12px",
  wordBreak: "break-all",
});

export const targetTextStyle = css({
  marginTop: "5px",
  fontSize: "11px",
  lineHeight: 1.5,
  color: "var(--operon-color-text-muted)",
});

export const inspectorActionsStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "8px",
  paddingTop: "4px",
});

// ── Properties editor ───────────────────────────────────────────────────────

export const fieldErrorStyle = css({
  marginTop: "5px",
  fontSize: "11px",
  lineHeight: 1.5,
  color: "var(--operon-color-danger)",
});

// ── Reference completion ────────────────────────────────────────────────────

export const propertiesWrapStyle = css({ position: "relative" });

/** Anchored under the field, the way an editor's completion list behaves. */
export const completionStyle = css({
  position: "absolute",
  left: 0,
  right: 0,
  top: "100%",
  marginTop: "4px",
  zIndex: 20,
  maxHeight: "168px",
  overflowY: "auto",
  borderRadius: "var(--operon-radius-sm)",
  backgroundColor: "var(--operon-color-surface)",
  boxShadow: "var(--operon-shadow-lg)",
  padding: "4px",
});

export const completionItemStyle = css({
  "&&": {
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "10px",
    height: "auto",
    padding: "6px 8px",
    borderRadius: "var(--operon-radius-xs)",
    fontWeight: 500,
    textAlign: "left",
  },
});

export const completionNameStyle = css({
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "12px",
  color: "var(--operon-color-primary)",
});

export const completionTypeStyle = css({
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--operon-color-text-subtle)",
});

export const completionEmptyStyle = css({
  position: "absolute",
  left: 0,
  right: 0,
  top: "100%",
  marginTop: "4px",
  zIndex: 20,
  padding: "8px 10px",
  borderRadius: "var(--operon-radius-sm)",
  backgroundColor: "var(--operon-color-surface)",
  boxShadow: "var(--operon-shadow-lg)",
  fontSize: "11px",
  color: "var(--operon-color-text-muted)",
});

/** Explains why a trigger is not offered for the selected element. */
export const unavailableStyle = css({
  marginTop: "6px",
  fontSize: "11px",
  lineHeight: 1.5,
  color: "var(--operon-color-text-subtle)",
});

/** What actually goes out, with sample values filled in. */
export const previewStyle = css({
  marginTop: "10px",
  padding: "8px 10px",
  borderRadius: "var(--operon-radius-sm)",
  backgroundColor: "var(--operon-color-surface-sunken)",
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "11px",
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  color: "var(--operon-color-text-muted)",
});

export const previewLabelStyle = css({
  marginBottom: "4px",
  fontFamily: "var(--operon-typography-body)",
  fontSize: "10px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--operon-color-text-subtle)",
});

// ── Trigger thresholds ──────────────────────────────────────────────────────

export const settingsRowStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "10px",
});

export const settingStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flex: 1,
  minWidth: "150px",
});

export const settingLabelStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-muted)",
  whiteSpace: "nowrap",
});

export const settingSuffixStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-subtle)",
  whiteSpace: "nowrap",
});

export const scopeNoticeStyle = css({
  margin: "auto",
  padding: "40px 20px",
  maxWidth: "48ch",
  textAlign: "center",
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--operon-color-text-muted)",
});
