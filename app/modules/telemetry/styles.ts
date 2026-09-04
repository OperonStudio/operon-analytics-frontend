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

export const toolbarStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
});

export const countStyle = css({
  fontSize: "12px",
  color: "var(--operon-color-text-muted)",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
});

export const streamStyle = css({
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-md)",
  backgroundColor: "var(--operon-color-surface)",
  overflow: "hidden",
});

/** A log line reads best as one row; below 861px it wraps rather than scrolls. */
export const rowStyle = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  gap: "10px",
  padding: "9px 14px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  fontSize: "12px",
  "&:last-child": { borderBottom: "none" },
  "&:hover": { backgroundColor: "var(--operon-color-surface-sunken)" },
});

export const timeStyle = css({
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "11px",
  color: "var(--operon-color-text-subtle)",
  flexShrink: 0,
});

export const eventStyle = css({
  fontWeight: 600,
  color: "var(--operon-color-text-strong)",
});

export const triggerStyle = css({
  padding: "1px 7px",
  borderRadius: "var(--operon-radius-full)",
  backgroundColor: "var(--operon-color-primary-ghost)",
  color: "var(--operon-color-primary)",
  fontSize: "11px",
  flexShrink: 0,
});

export const elementStyle = css({
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "11px",
  color: "var(--operon-color-text-muted)",
});

export const urlStyle = css({
  marginLeft: "auto",
  fontSize: "11px",
  color: "var(--operon-color-text-subtle)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "260px",
});

export const propertiesStyle = css({
  flexBasis: "100%",
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "11px",
  color: "var(--operon-color-text-muted)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const emptyStyle = css({
  padding: "40px 20px",
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--operon-color-text-muted)",
  textAlign: "center",
  maxWidth: "56ch",
  margin: "0 auto",
});
