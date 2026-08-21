import { RootDocument } from "#/modules/root-document";
import "@morph-css/kit/css";
import { Command, Layers, LayoutDashboard, Terminal } from "@operonstudio/icons";
import operonMorphCss from "@operonstudio/ui/dist/morphcss.css?url";
import operonCss from "@operonstudio/ui/dist/style.css?url";
import { createRootRouteWithContext } from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Operon Analytics",
      },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
      {
        rel: "preload",
        as: "style",
        href: operonCss,
      },
      {
        rel: "preload",
        as: "style",
        href: operonMorphCss,
      },
      {
        rel: "stylesheet",
        href: operonCss,
      },
      {
        rel: "stylesheet",
        href: operonMorphCss,
      },
    ],
  }),
  staticData: {
    sidebarGroups: [
      {
        title: "ANALYTICS",
        items: [
          { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
          { label: "Visual Trackers", icon: Layers, href: "/trackers" },
          { label: "Telemetry Logs", icon: Terminal, href: "/telemetry" },
          { label: "User Funnels", icon: Command, href: "/funnels" },
          { label: "Visual Editor", icon: Layers, href: "/visual-editor" },
        ],
      },
    ],
  },
  shellComponent: RootDocument,
});
