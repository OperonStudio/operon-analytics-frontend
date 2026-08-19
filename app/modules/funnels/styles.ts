import { css } from "@morph-css/kit";

export const pageContainerStyle = css({
  padding: "40px",
  maxWidth: "1280px",
  margin: "0 auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

export const titleStyle = css({
  fontSize: "15px",
  fontWeight: "600",
  color: "var(--operon-color-text, #000)",
});

export const subtitleStyle = css({
  fontSize: "13px",
  color: "var(--operon-color-text-muted, #666)",
  marginTop: "2px",
});

export const funnelCardStyle = css({
  padding: "24px",
  borderRadius: "var(--operon-radius-md, 8px)",
  border: "1px solid var(--operon-color-border, #eaeaea)",
  backgroundColor: "var(--operon-color-surface, #fff)",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const funnelRowStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const funnelLabelStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "13px",
  fontWeight: "500",
  color: "var(--operon-color-text, #000)",
});

export const trackBarStyle = css({
  width: "100%",
  height: "20px",
  borderRadius: "var(--operon-radius-sm, 6px)",
  backgroundColor: "var(--operon-color-surface-raised, #f4f4f5)",
  overflow: "hidden",
});

export const funnelCountStyle = css({
  fontSize: "13px",
  color: "var(--operon-color-text-muted, #666)",
});
