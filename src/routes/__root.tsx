import { RootDocument } from "#/modules/root-document";
import "@morph-css/kit/css";
import {
  Braces,
  Eye,
  Layers,
  LayoutDashboard,
  Plug,
  Terminal,
} from "@operonstudio/icons";
import operonMorphCss from "@operonstudio/ui/dist/morphcss.css?url";
import operonCss from "@operonstudio/ui/dist/style.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";

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
          { label: "Install", icon: Plug, href: "/setup" },
          { label: "Visual Editor", icon: Eye, href: "/visual-editor" },
          { label: "Trackers", icon: Layers, href: "/trackers" },
          { label: "Context", icon: Braces, href: "/context" },
          { label: "Events", icon: Terminal, href: "/telemetry" },
        ],
      },
    ],
  },
  shellComponent: RootDocument,
});
