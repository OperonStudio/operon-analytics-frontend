import { TopProgressBar } from "#/components/top-progress-bar";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import { AuthGate, AuthProvider, extractTokenFromURL } from "@operonstudio/auth";
import { ThemeProvider, Toaster } from "@operonstudio/ui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { DashboardLayout } from "../dashboard/dashboard-layout";

const HOMEPAGE_URL =
  (typeof window !== "undefined" &&
    window.location.hostname.endsWith("operonstudio.tech")) ||
  import.meta.env.PROD
    ? "https://operonstudio.tech"
    : (import.meta.env.VITE_HOMEPAGE_URL ?? "http://localhost:4001");

// Extract token synchronously before TanStack Router mounts and strips it
if (typeof window !== "undefined") {
  extractTokenFromURL();
}

export const RootDocument = ({ children }: { children: React.ReactNode }) => {
  const location = useRouterState({ select: (s) => s.location });
  const isFullScreen =
    location.pathname.startsWith("/visual-editor") ||
    location.pathname.startsWith("/codeblocks");

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style>{`
          @media (max-width: 900px) {
            aside {
              display: none !important;
            }
          }
        `}</style>
      </head>
      <body>
        <ThemeProvider defaultDark={false}>
          <AuthProvider
            refreshUrl="/api/auth/refresh"
            enableUrlTokenBridge={true}
          >
            <AuthGate homepageUrl={HOMEPAGE_URL}>
              <TopProgressBar />
              <Toaster />
              {isFullScreen ? children : <DashboardLayout>{children}</DashboardLayout>}
            </AuthGate>
          </AuthProvider>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
};
