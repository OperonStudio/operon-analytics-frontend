import { css } from "@morph-css/kit";
import {
  DESKTOP_QUERY,
  PAGE_PADDING,
  PAGE_PADDING_MOBILE,
} from "#/common/layout";

export const pageStyle = css({
  padding: PAGE_PADDING_MOBILE,
  boxSizing: "border-box",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  [DESKTOP_QUERY]: { padding: PAGE_PADDING },
});

export const searchRowStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
});

/**
 * A table drawn with grid rather than <table>, so the columns collapse to a
 * stack on narrow screens instead of scrolling sideways.
 */
export const tableStyle = css({
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-md)",
  backgroundColor: "var(--operon-color-surface)",
  overflow: "hidden",
});

const columns = "minmax(0, 2fr) minmax(0, 2fr) 110px 90px 96px";

export const headRowStyle = css({
  display: "none",
  gridTemplateColumns: columns,
  gap: "12px",
  padding: "9px 16px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  backgroundColor: "var(--operon-color-surface-sunken)",
  fontSize: "11px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "var(--operon-color-text-muted)",
  "@media (min-width: 861px)": { display: "grid" },
});

export const rowStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  padding: "12px 16px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  "&:last-child": { borderBottom: "none" },
  "@media (min-width: 861px)": {
    display: "grid",
    gridTemplateColumns: columns,
    gap: "12px",
    alignItems: "center",
  },
});

export const eventCellStyle = css({ minWidth: 0 });

export const eventNameStyle = css({
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const sourceStyle = css({
  marginTop: "2px",
  fontSize: "11px",
  color: "var(--operon-color-text-subtle)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const monoCellStyle = css({
  minWidth: 0,
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "12px",
  color: "var(--operon-color-text-muted)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const triggerCellStyle = css({
  fontSize: "12px",
  color: "var(--operon-color-text-muted)",
});

export const numericCellStyle = css({
  fontSize: "13px",
  fontVariantNumeric: "tabular-nums",
  color: "var(--operon-color-text)",
  "@media (min-width: 861px)": { textAlign: "right" },
});

export const actionsCellStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  "@media (min-width: 861px)": { justifyContent: "flex-end" },
});

// ── Empty states ────────────────────────────────────────────────────────────

export const emptyStyle = css({
  padding: "28px 16px",
  fontSize: "13px",
  color: "var(--operon-color-text-muted)",
  textAlign: "center",
});

export const emptyCardStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "10px",
  padding: "32px",
  border: "1px dashed var(--operon-color-border)",
  borderRadius: "var(--operon-radius-md)",
  backgroundColor: "var(--operon-color-surface)",
  maxWidth: "560px",
});

export const emptyIconStyle = css({ color: "var(--operon-color-text-muted)" });

export const emptyTitleStyle = css({
  fontSize: "15px",
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
});

export const emptyBodyStyle = css({
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--operon-color-text-muted)",
  maxWidth: "56ch",
});
