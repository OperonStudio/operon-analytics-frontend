import { css } from "@morph-css/kit";

export const pageContainerStyle = css({
  padding: "40px",
  maxWidth: "1280px",
  margin: "0 auto",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
});

export const kpiGridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "16px",
});

export const kpiCardStyle = css({
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  borderRadius: "var(--operon-radius-md, 8px)",
  border: "1px solid var(--operon-color-border, #eaeaea)",
  backgroundColor: "var(--operon-color-surface, #fff)",
});

export const kpiLabelStyle = css({
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--operon-color-text-muted, #666)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
});

export const kpiValueStyle = css({
  fontSize: "28px",
  fontWeight: "700",
  color: "var(--operon-color-text, #000)",
  letterSpacing: "-0.02em",
  lineHeight: "1.1",
});

export const kpiSubtextStyle = css({
  fontSize: "13px",
  color: "var(--operon-color-text-muted, #666)",
});

export const chartContainerStyle = css({
  padding: "24px",
  borderRadius: "var(--operon-radius-md, 8px)",
  border: "1px solid var(--operon-color-border, #eaeaea)",
  backgroundColor: "var(--operon-color-surface, #fff)",
});

export const chartTitleStyle = css({
  fontSize: "15px",
  fontWeight: "600",
  color: "var(--operon-color-text, #000)",
  marginBottom: "4px",
});

export const chartSubtitleStyle = css({
  fontSize: "13px",
  color: "var(--operon-color-text-muted, #666)",
  marginBottom: "20px",
});

export const tableContainerStyle = css({
  padding: "24px",
  borderRadius: "var(--operon-radius-md, 8px)",
  border: "1px solid var(--operon-color-border, #eaeaea)",
  backgroundColor: "var(--operon-color-surface, #fff)",
});

export const tableTitleStyle = css({
  fontSize: "15px",
  fontWeight: "600",
  color: "var(--operon-color-text, #000)",
  marginBottom: "16px",
});

export const tableStyle = css({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "13px",
});

export const tableHeadStyle = css({
  borderBottom: "1px solid var(--operon-color-border, #eaeaea)",
  color: "var(--operon-color-text-muted, #666)",
  textAlign: "left",
});

export const thStyle = css({
  padding: "10px 12px",
  fontWeight: "600",
  fontSize: "12px",
});

export const tdStyle = css({
  padding: "12px",
  color: "var(--operon-color-text, #000)",
  borderBottom: "1px solid var(--operon-color-border, #f5f5f5)",
});

export const codeBadgeStyle = css({
  backgroundColor: "var(--operon-color-surface-raised, #f4f4f5)",
  padding: "2px 8px",
  borderRadius: "4px",
  fontFamily: "monospace",
  fontSize: "12px",
  color: "var(--operon-color-text, #000)",
});

export const statusBadgeStyle = css({
  padding: "2px 10px",
  borderRadius: "var(--operon-radius-full, 999px)",
  backgroundColor: "var(--operon-color-success-ghost, rgba(16,185,129,0.1))",
  color: "var(--operon-color-success, #10b981)",
  fontSize: "11px",
  fontWeight: "600",
});

export const timePillsStyle = css({
  display: "flex",
  gap: "2px",
  padding: "2px",
  borderRadius: "var(--operon-radius-sm, 6px)",
  border: "1px solid var(--operon-color-border, #eaeaea)",
  backgroundColor: "var(--operon-color-background, #fafafa)",
});

export const pillButtonStyle = css({
  padding: "4px 12px",
  fontSize: "12px",
  fontWeight: "500",
  borderRadius: "var(--operon-radius-xs, 4px)",
  border: "none",
  cursor: "var(--operon-cursor-pointer, pointer)",
  backgroundColor: "transparent",
  color: "var(--operon-color-text-muted, #666)",
  transition: "all 0.15s ease",
});

export const pillButtonActiveStyle = css({
  backgroundColor: "var(--operon-color-surface, #fff)",
  color: "var(--operon-color-primary, #6366f1)",
  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  fontWeight: "600",
});

export const toolbarStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  flexWrap: "wrap",
});
