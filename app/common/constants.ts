export const APP_NAME = "Analytics";
export const ORG_NAME = "Operon";
export const PRODUCT_NAME = `${ORG_NAME} ${APP_NAME}`;

/**
 * The package a customer installs.
 *
 * Named once here because it appears in the install command, the import in the
 * snippet and the docs, and a rename that reaches two of the three produces
 * instructions that do not work.
 */
export const SDK_PACKAGE = "@operonstudio/sdk";

/**
 * Where the sibling products live.
 *
 * Resolved once here rather than in each component that links out, so the
 * production hostnames and the local ports cannot drift apart between them.
 */
const isProdDomain =
  typeof window !== "undefined" &&
  window.location.hostname.endsWith("operonstudio.tech");

const isProd = isProdDomain || import.meta.env.PROD;

export const HOMEPAGE_URL = isProd
  ? "https://operonstudio.tech"
  : (import.meta.env.VITE_HOMEPAGE_URL ?? "http://localhost:4001");

export const COMPOSE_URL = isProd
  ? "https://compose.operonstudio.tech"
  : (import.meta.env.VITE_COMPOSE_URL ?? "http://localhost:4000");

export const CODEBLOCKS_URL = isProd
  ? "https://codeblocks.operonstudio.tech"
  : (import.meta.env.VITE_CODEBLOCKS_URL ?? "http://localhost:4002");

export const ANALYTICS_URL = isProd
  ? "https://analytics.operonstudio.tech"
  : (import.meta.env.VITE_ANALYTICS_URL ?? "http://localhost:4003");
