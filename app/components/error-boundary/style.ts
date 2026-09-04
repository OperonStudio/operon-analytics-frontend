import { css } from "@morph-css/kit";

export const containerStyle = css({
  minHeight: "100vh",
  padding: "32px",
  fontFamily: "var(--operon-typography-body)",
});

export const cardStyle = css({
  padding: "40px",
  maxWidth: "500px",
  textAlign: "center",
});

export const iconStyle = css({
  color: "var(--operon-color-danger, #c2321f)",
});

export const headingStyle = css({
  margin: 0,
  fontSize: "2rem",
  fontWeight: "bold",
  color: "var(--operon-color-text, #16151a)",
});

export const textStyle = css({
  margin: 0,
  fontSize: "1rem",
  color: "var(--operon-color-text-muted, #8a868c)",
  lineHeight: "1.5",
});

export const buttonGroupStyle = css({
  marginTop: "24px",
});
