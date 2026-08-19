import { TopProgressBar } from "#/components/top-progress-bar";
import { AppThemeProvider } from "#/contexts/theme";
import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools";
import { AuthGate, AuthProvider, extractTokenFromURL } from "@operon/auth";
import { Toaster } from "@operon/ui";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { DashboardLayout } from "../dashboard/dashboard-layout";

const AUTH_API_URL = import.meta.env.VITE_OPERON_AUTH_API_URL ?? "http://localhost:8081";
const HOMEPAGE_URL = import.meta.env.VITE_HOMEPAGE_URL ?? "http://localhost:4001";

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
      </head>
      <body>
        <AuthProvider refreshUrl={`${AUTH_API_URL}/api/auth/refresh`}>
          <AppThemeProvider>
            <AuthGate homepageUrl={HOMEPAGE_URL}>
              <TopProgressBar />
              <Toaster />
              {isFullScreen ? children : <DashboardLayout>{children}</DashboardLayout>}
            </AuthGate>
          </AppThemeProvider>
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
      </body>
    </html>
  );
};
