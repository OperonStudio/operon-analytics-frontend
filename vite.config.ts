import { devtools } from "@tanstack/devtools-vite";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import viteCompression from "vite-plugin-compression";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

import { morphcss } from "@morph-css/kit/vite";
import babel from "@rolldown/plugin-babel";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";

const repoRoot = path.resolve("..");

/**
 * Resolves a backend origin from the first environment variable that is set.
 *
 * A fallback is always supplied: concatenating an unset variable produces a
 * proxy target of `undefined/api/...`, which fails at request time with a 502
 * rather than at startup, and is confusing to diagnose.
 */
function backendOrigin(
  env: Record<string, string>,
  fallback: string,
  ...names: string[]
): string {
  for (const name of names) {
    const value = env[name]?.trim();
    if (value) return value.replace(/\/+$/, "");
  }
  return fallback;
}

/**
 * Where each service lives when no environment variable names it.
 *
 * A production build that falls back to localhost is simply wrong: the Nitro
 * server proxies to that target from inside the Vercel function, where nothing
 * is listening on 8081, so every platform call fails and the console answers
 * its own front page with a 500. The `vercel.json` rewrites cover requests that
 * arrive from a browser, but not the ones the server makes while rendering.
 */
const PRODUCTION_ORIGINS = {
  platform: "https://operon-homepage-backend.onrender.com",
  compose: "https://operon-compose-backend.onrender.com",
  analytics: "https://operon-analytics-backend.onrender.com",
  codeblocks: "https://operon-codeblocks-backend.onrender.com",
};

const LOCAL_ORIGINS = {
  platform: "http://localhost:8081",
  compose: "http://localhost:8080",
  analytics: "http://localhost:8083",
  codeblocks: "http://localhost:8084",
};

const config = defineConfig(({ mode }) => {
  // loadEnv, not process.env: Vite does not put .env files on process.env, so
  // reading it there meant the values in .env were silently ignored and the
  // fallbacks were always what got used.
  const env = loadEnv(mode, process.cwd(), "");
  const origins = mode === "production" ? PRODUCTION_ORIGINS : LOCAL_ORIGINS;

  // Auth and the shared platform — workspaces, environments, projects, members
  // and API keys — are both served by operon-homepage-backend. Analytics reads
  // and writes them there rather than keeping its own copy, so a workspace
  // created here is the same record every other console sees.
  const platformBackend = backendOrigin(
    env,
    origins.platform,
    "VITE_OPERON_PLATFORM_API_URL",
    "VITE_OPERON_AUTH_API_URL",
    "OPERON_HOMEPAGE_BACKEND_URL",
  );

  const analyticsBackend = backendOrigin(
    env,
    origins.analytics,
    "VITE_OPERON_ANALYTICS_BACKEND_URL",
    "OPERON_ANALYTICS_BACKEND_URL",
  );

  return {
    resolve: { tsconfigPaths: true },
    server: {
      fs: {
        allow: [repoRoot],
      },
    },
    plugins: [
      devtools(),
      morphcss(),
      tanstackStart(),
      nitro({
        routeRules: {
          // Order matters: the first two are more specific than the catch-all
          // below them, which is what keeps a platform call from being sent to
          // the analytics service.
          "/api/auth/**": { proxy: `${platformBackend}/api/auth/**` },
          "/platform/api/**": { proxy: `${platformBackend}/api/**` },
          "/api/**": { proxy: `${analyticsBackend}/api/**` },
        },
      }),
      viteReact(),
      babel({ presets: [reactCompilerPreset()] }),
      viteCompression({ algorithm: "brotliCompress" }),
      viteCompression({ algorithm: "gzip" }),
    ],
  };
});

export default config;
