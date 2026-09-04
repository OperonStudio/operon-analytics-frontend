import { css as style } from "@morph-css/kit";

export const pageContainerStyle = style({
  padding: "40px 60px",
  maxWidth: "1280px",
  margin: "0 auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  minHeight: "100%",
  backgroundImage:
    "radial-gradient(circle at top right, rgba(99, 102, 241, 0.04) 0%, transparent 80%)",
});

export const headerTitleStyle = style({
  fontSize: "28px",
  fontWeight: 800,
  color: "var(--operon-color-text)",
  letterSpacing: "-0.03em",
  marginBottom: "8px",
});

export const headerSubtitleStyle = style({
  fontSize: "14px",
  color: "var(--operon-color-text-muted)",
  marginTop: "4px",
});

export const statLabelStyle = style({
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--operon-color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "1px",
});

export const statValueStyle = style({
  fontSize: "36px",
  fontWeight: 800,
  color: "var(--operon-color-text)",
  letterSpacing: "-0.04em",
  lineHeight: "1.1",
});

export const statUnitStyle = style({
  fontSize: "14px",
  fontWeight: 600,
  color: "var(--operon-color-text-muted)",
  marginLeft: "4px",
});
