import { devtools } from "@tanstack/devtools-vite";
import path from "node:path";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

import { morphcss } from "@morph-css/kit/vite";
import babel from "@rolldown/plugin-babel";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";

const repoRoot = path.resolve("..");

const config = defineConfig({
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
        "/api/auth/**": {
          proxy:
            (process.env.VITE_OPERON_AUTH_API_URL || "http://localhost:8081") +
            "/api/auth/**",
        },
        "/api/**": {
          proxy:
            (process.env.VITE_OPERON_ANALYTICS_BACKEND_URL ||
              "http://localhost:8083") + "/api/**",
        },
      },
    }),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
    viteCompression({ algorithm: "brotliCompress" }),
    viteCompression({ algorithm: "gzip" }),
  ],
});

export default config;
