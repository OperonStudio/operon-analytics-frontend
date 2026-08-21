import { css } from "@morph-css/kit";

// Layout is now provided by `<AppShell>` from `@operonstudio/ui`. Only sidebar-footer
// slot decorations remain here.

export const rootStyle = css({
  width: "100%",
});

export const orgLineStyle = css({
  fontSize: "11px",
  fontWeight: "600",
  color: "var(--operon-color-text)",
  lineHeight: 1.3,
});

export const appLineStyle = css({
  fontSize: "10px",
  color: "var(--operon-color-text-muted)",
  lineHeight: 1.3,
  letterSpacing: "0.03em",
});

export const themeToggleStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "6px",
});
