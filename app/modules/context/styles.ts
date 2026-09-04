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

export const introStyle = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
});

export const introTextStyle = css({
  fontSize: "13px",
  lineHeight: 1.65,
  color: "var(--operon-color-text-muted)",
  maxWidth: "68ch",
});

export const tableStyle = css({
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-md)",
  backgroundColor: "var(--operon-color-surface)",
  overflow: "hidden",
});

export const rowStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  padding: "12px 16px",
  borderBottom: "1px solid var(--operon-color-border-subtle)",
  "&:last-child": { borderBottom: "none" },
  "@media (min-width: 769px)": {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) 90px minmax(0, 2fr) 110px",
    gap: "12px",
    alignItems: "center",
  },
});

/** Shown as the reference form, because that is how it gets used. */
export const refStyle = css({
  fontFamily: "var(--operon-typography-mono)",
  fontSize: "12px",
  color: "var(--operon-color-primary)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const typeStyle = css({
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "var(--operon-color-text-subtle)",
});

export const descriptionStyle = css({
  fontSize: "13px",
  color: "var(--operon-color-text-muted)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const actionsStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  "@media (min-width: 769px)": { justifyContent: "flex-end" },
});

export const labelStyle = css({
  display: "block",
  marginBottom: "5px",
  fontSize: "12px",
  fontWeight: 600,
  color: "var(--operon-color-text)",
});

export const hintStyle = css({
  marginTop: "5px",
  fontSize: "11px",
  lineHeight: 1.5,
  color: "var(--operon-color-text-subtle)",
});

export const emptyStyle = css({
  padding: "28px 16px",
  fontSize: "13px",
  color: "var(--operon-color-text-muted)",
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
