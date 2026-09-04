/**
 * Shared page padding.
 *
 * The app shell pads the content area only on small screens, so every
 * full-width page supplies its own. These two constants keep the products on
 * one rhythm instead of each picking a different value.
 */
export const PAGE_PADDING = "24px 32px 64px";
export const PAGE_PADDING_MOBILE = "20px 16px 48px";

/** Breakpoint above which a page uses its desktop layout. */
export const DESKTOP_QUERY = "@media (min-width: 769px)";
