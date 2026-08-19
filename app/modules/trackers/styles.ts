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

export const headerRowStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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

export const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "16px",
});

export const trackerCardStyle = css({
  padding: "20px",
  borderRadius: "var(--operon-radius-md, 8px)",
  border: "1px solid var(--operon-color-border, #eaeaea)",
  backgroundColor: "var(--operon-color-surface, #fff)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const trackerNameStyle = css({
  fontSize: "14px",
  fontWeight: "600",
  color: "var(--operon-color-text, #000)",
});

export const selectorTextStyle = css({
  fontSize: "12px",
  color: "var(--operon-color-text-muted, #666)",
});

export const codeTagStyle = css({
  backgroundColor: "var(--operon-color-surface-raised, #f4f4f5)",
  padding: "1px 6px",
  borderRadius: "4px",
  fontFamily: "monospace",
  fontSize: "12px",
});

export const trackerFooterStyle = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTop: "1px solid var(--operon-color-border, #eaeaea)",
  paddingTop: "10px",
  marginTop: "4px",
  fontSize: "12px",
  color: "var(--operon-color-text-muted, #666)",
});

export const statusDotStyle = css({
  padding: "2px 10px",
  borderRadius: "var(--operon-radius-full, 999px)",
  backgroundColor: "var(--operon-color-success-ghost, rgba(16,185,129,0.1))",
  color: "var(--operon-color-success, #10b981)",
  fontSize: "11px",
  fontWeight: "600",
});

export const formContainerStyle = css({
  padding: "20px",
  borderRadius: "var(--operon-radius-md, 8px)",
  border: "1px solid var(--operon-color-primary, #6366f1)",
  backgroundColor: "var(--operon-color-surface, #fff)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

export const inputStyle = css({
  padding: "8px 12px",
  fontSize: "13px",
  border: "1px solid var(--operon-color-border, #eaeaea)",
  borderRadius: "var(--operon-radius-sm, 6px)",
  outline: "none",
  backgroundColor: "var(--operon-color-background, #fafafa)",
  color: "var(--operon-color-text, #000)",
});
