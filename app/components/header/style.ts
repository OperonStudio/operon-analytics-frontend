import { css } from "@morph-css/kit";

export const headerWrapperStyle = css({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

export const topbarStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flex: 1,
  minWidth: 0,
  gap: "12px",
});

export const desktopBreadcrumbStyle = css({
  display: "flex",
  alignItems: "center",
  "@media (max-width: 900px)": {
    display: "none",
  },
});

export const mobileBreadcrumbBarStyle = css({
  display: "none",
  "@media (max-width: 900px)": {
    display: "flex",
    alignItems: "center",
    overflowX: "auto",
    whiteSpace: "nowrap",
    WebkitOverflowScrolling: "touch",
    padding: "6px 12px",
    borderTop: "1px solid var(--operon-color-border-subtle, #f0f0f0)",
    backgroundColor: "var(--operon-color-surface, #ffffff)",
    scrollbarWidth: "none",
  },
});

export const searchContainerStyle = css({
  flex: 1,
  maxWidth: "450px",
  display: "flex",
  alignItems: "center",
  "@media (max-width: 768px)": {
    display: "none",
  },
});

export const rightActionsStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginLeft: "auto",
  flexShrink: 0,
});

export const shortcutIconStyle = css({
  opacity: 0.5,
  fontSize: "12px",
});

export const iconButtonStyle = css({
  padding: "6px",
});

