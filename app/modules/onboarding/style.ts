import { css } from "@morph-css/kit";

export const backdropStyle = css({
  position: "fixed",
  inset: 0,
  backgroundColor: "var(--operon-color-overlay)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  zIndex: "var(--operon-z-modal)",
});

export const cardStyle = css({
  width: "100%",
  maxWidth: "440px",
  backgroundColor: "var(--operon-color-surface)",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-lg)",
  boxShadow: "var(--operon-shadow-xl)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

export const eyebrowStyle = css({
  fontSize: "10px",
  fontWeight: "600",
  color: "var(--operon-color-primary)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
});

export const titleStyle = css({
  fontSize: "18px",
  fontWeight: "700",
  color: "var(--operon-color-text)",
  letterSpacing: "-0.005em",
});

export const bodyStyle = css({
  fontSize: "13px",
  color: "var(--operon-color-text-muted)",
  lineHeight: "1.5",
});

export const fieldGroupStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

export const labelStyle = css({
  fontSize: "12px",
  fontWeight: "500",
  color: "var(--operon-color-text)",
});

export const helpStyle = css({
  fontSize: "11px",
  color: "var(--operon-color-text-subtle)",
});

export const actionsStyle = css({
  display: "flex",
  gap: "8px",
  justifyContent: "flex-end",
  marginTop: "4px",
});

export const suggestionsRowStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
  marginTop: "4px",
});

export const suggestionChipStyle = css({
  padding: "3px 8px",
  fontSize: "11px",
  fontWeight: "500",
  border: "1px solid var(--operon-color-border)",
  borderRadius: "var(--operon-radius-full)",
  backgroundColor: "transparent",
  color: "var(--operon-color-text-muted)",
  cursor: "pointer",
  transition:
    "background-color var(--operon-motion-fast) var(--operon-motion-easing), color var(--operon-motion-fast) var(--operon-motion-easing)",
  "&:hover": {
    backgroundColor: "var(--operon-color-primary-ghost)",
    color: "var(--operon-color-primary)",
    borderColor: "var(--operon-color-primary)",
  },
});

export const centeredLoaderStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "60vh",
  color: "var(--operon-color-text-muted)",
  fontSize: "13px",
});

export const errorPanelStyle = css({
  ...cardStyle,
  border: "1px solid var(--operon-color-danger)",
  backgroundColor: "var(--operon-color-danger-ghost)",
  color: "var(--operon-color-danger)",
});
