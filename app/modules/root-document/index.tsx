import { AuthProvider, RequireAuth } from "@operonstudio/auth";
import { ThemeProvider, Toaster } from "@operonstudio/ui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TopProgressBar } from "#/components/top-progress-bar";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import { DashboardLayout } from "../dashboard/dashboard-layout";

const HOMEPAGE_URL =
  (typeof window !== "undefined" &&
    window.location.hostname.endsWith("operonstudio.tech")) ||
  import.meta.env.PROD
    ? "https://operonstudio.tech"
    : (import.meta.env.VITE_HOMEPAGE_URL ?? "http://localhost:4001");

export const RootDocument = ({ children }: { children: React.ReactNode }) => {
  const location = useRouterState({ select: (s) => s.location });
  const isFullScreen =
    location.pathname.startsWith("/visual-editor") ||
    location.pathname.startsWith("/codeblocks");

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultDark={false}>
          {/* The session is an httpOnly cookie scoped to the domain, so it is
              already present on this subdomain. The URL token bridge this
              replaces passed a JWT through the query string, which put it in
              browser history, server logs and any referrer header. */}
          <AuthProvider>
            <RequireAuth homepageUrl={HOMEPAGE_URL}>
              <TopProgressBar />
              <Toaster />
              {isFullScreen ? (
                children
              ) : (
                <DashboardLayout>{children}</DashboardLayout>
              )}
            </RequireAuth>
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
