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

export const searchInputStyle = css({
  width: "240px",
  padding: "6px 12px",
  fontSize: "13px",
  border: "1px solid var(--operon-color-border, #eaeaea)",
  borderRadius: "var(--operon-radius-sm, 6px)",
  outline: "none",
  backgroundColor: "var(--operon-color-background, #fafafa)",
  color: "var(--operon-color-text, #000)",
});

export const tableWrapperStyle = css({
  borderRadius: "var(--operon-radius-md, 8px)",
  border: "1px solid var(--operon-color-border, #eaeaea)",
  backgroundColor: "var(--operon-color-surface, #fff)",
  overflow: "hidden",
});

export const tableStyle = css({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "13px",
});

export const tableHeadRowStyle = css({
  backgroundColor: "var(--operon-color-background, #fafafa)",
  borderBottom: "1px solid var(--operon-color-border, #eaeaea)",
  color: "var(--operon-color-text-muted, #666)",
  textAlign: "left",
});

export const thStyle = css({
  padding: "10px 16px",
  fontWeight: "600",
  fontSize: "12px",
});

export const tdStyle = css({
  padding: "10px 16px",
  color: "var(--operon-color-text, #000)",
  borderBottom: "1px solid var(--operon-color-border, #f5f5f5)",
});

export const methodPostStyle = css({
  fontWeight: "600",
  color: "var(--operon-color-primary, #6366f1)",
});

export const methodGetStyle = css({
  fontWeight: "600",
  color: "var(--operon-color-success, #10b981)",
});

export const eventTagStyle = css({
  backgroundColor: "var(--operon-color-primary-ghost, rgba(99,102,241,0.08))",
  color: "var(--operon-color-primary, #6366f1)",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
});

export const statusBadgeStyle = css({
  backgroundColor: "var(--operon-color-success-ghost, rgba(16,185,129,0.1))",
  color: "var(--operon-color-success, #10b981)",
  padding: "2px 10px",
  borderRadius: "var(--operon-radius-full, 999px)",
  fontSize: "11px",
  fontWeight: "600",
});

export const timestampStyle = css({
  color: "var(--operon-color-text-muted, #666)",
  fontSize: "12px",
});
