import { css } from "@morph-css/kit";
import {
  DESKTOP_QUERY,
  PAGE_PADDING,
  PAGE_PADDING_MOBILE,
} from "#/common/layout";

export const pageStyle = css({
  padding: PAGE_PADDING_MOBILE,
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  maxWidth: "860px",
  [DESKTOP_QUERY]: { padding: PAGE_PADDING },
});

export const stepStyle = css({
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-lg, 12px)",
  background: "var(--operon-color-surface)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const stepHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

export const stepNumberStyle = css({
  width: "24px",
  height: "24px",
  flexShrink: 0,
  borderRadius: "999px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 600,
  background: "var(--operon-color-primary)",
  color: "var(--operon-color-on-primary, #fff)",
});

export const stepTitleStyle = css({
  fontSize: "15px",
  fontWeight: 600,
  color: "var(--operon-color-text)",
});

export const bodyStyle = css({
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--operon-color-text-muted)",
});

export const codeBlockStyle = css({
  position: "relative",
  fontFamily: "var(--operon-font-mono, ui-monospace, monospace)",
  fontSize: "12px",
  lineHeight: 1.7,
  whiteSpace: "pre",
  overflowX: "auto",
  padding: "12px 14px",
  borderRadius: "var(--operon-radius-md, 8px)",
  background: "var(--operon-color-background-subtle, rgba(0,0,0,0.04))",
  border: "1px solid var(--operon-color-border)",
  color: "var(--operon-color-text)",
});

export const rowStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
});

export const statusStyle = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "13px",
  fontWeight: 500,
});

export const dotStyle = css({
  width: "8px",
  height: "8px",
  borderRadius: "999px",
  flexShrink: 0,
});

export const envRowStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: "10px 12px",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-md, 8px)",
});

export const envNameStyle = css({
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--operon-color-text)",
});

export const mutedStyle = css({
  fontSize: "12px",
  color: "var(--operon-color-text-subtle)",
});

export const warningStyle = css({
  fontSize: "12px",
  lineHeight: 1.6,
  padding: "10px 12px",
  borderRadius: "var(--operon-radius-md, 8px)",
  border: "1px solid var(--operon-color-warning, #e6a700)",
  color: "var(--operon-color-text)",
});
