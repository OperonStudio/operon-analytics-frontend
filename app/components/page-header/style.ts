import { css } from "@morph-css/kit";

export const pageHeaderContainerStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px 32px",
  borderBottom: "1px solid var(--operon-color-border, #e2ddda)",
  backgroundColor: "var(--operon-color-surface, #ffffff)",
});

export const titleGroupStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const titleStyle = css({
  fontSize: "20px",
  fontWeight: "600",
  color: "var(--operon-color-text, #16151a)",
  margin: 0,
});

export const descriptionStyle = css({
  fontSize: "14px",
  color: "var(--operon-color-text-muted, #8a868c)",
  margin: 0,
});
