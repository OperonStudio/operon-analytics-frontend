import { APP_NAME, ORG_NAME } from "#/common/constants";
import { Header } from "#/components/header";
import { WorkspaceSwitcher } from "#/components/workspace-switcher";
import { cx } from "@morph-css/kit";
import { getToken, useAuth } from "@operonstudio/auth";
import { BarChart3, Code, Database, Moon, Sun } from "@operonstudio/icons";
import {
  AppShell,
  type AppShellNavGroup,
  type AppShellNavItem,
  type AppShellProduct,
  Toggle,
  useTheme,
} from "@operonstudio/ui";
import { Link, useLocation, useMatches } from "@tanstack/react-router";
import * as classes from "./style";

const isProdDomain =
  typeof window !== "undefined" &&
  window.location.hostname.endsWith("operonstudio.tech");

const HOMEPAGE_URL =
  isProdDomain || import.meta.env.PROD
    ? "https://operonstudio.tech"
    : (import.meta.env.VITE_HOMEPAGE_URL ?? "http://localhost:4001");
const COMPOSE_URL =
  isProdDomain || import.meta.env.PROD
    ? "https://compose.operonstudio.tech"
    : (import.meta.env.VITE_COMPOSE_URL ?? "http://localhost:4000");
const CODEBLOCKS_URL =
  isProdDomain || import.meta.env.PROD
    ? "https://codeblocks.operonstudio.tech"
    : (import.meta.env.VITE_CODEBLOCKS_URL ?? "http://localhost:4002");
const ANALYTICS_URL =
  isProdDomain || import.meta.env.PROD
    ? "https://analytics.operonstudio.tech"
    : (import.meta.env.VITE_ANALYTICS_URL ?? "http://localhost:4003");

const PRODUCTS: AppShellProduct[] = [
  {
    key: "compose",
    label: "Compose",
    description: "Dynamic data & rules",
    url: COMPOSE_URL,
    icon: <Database size={16} />,
  },
  {
    key: "codeblocks",
    label: "Codeblocks",
    description: "Backend orchestration",
    url: CODEBLOCKS_URL,
    icon: <Code size={16} />,
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Visual event binding",
    url: ANALYTICS_URL,
    icon: <BarChart3 size={16} />,
  },
];

function bridgeToken(baseUrl: string): string {
  const token = getToken();
  if (!token) return baseUrl;
  const url = new URL(baseUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const matches = useMatches();
  const matchWithSidebar = matches.find((m) => m.staticData?.sidebarGroups);
  const { sidebarGroups = [] } = matchWithSidebar?.staticData || {};
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const navGroups: AppShellNavGroup[] = sidebarGroups.map((group: any, i: number) => ({
    key: `${group.title ?? "group"}-${i}`,
    title: group.title,
    items: group.items.map((item: any, j: number) => {
      const Icon = item.icon;
      const isActive =
        item.href === "/"
          ? location.pathname === "/"
          : location.pathname.startsWith(item.href);
      const isExternal = item.href.startsWith("http");
      const render: AppShellNavItem["render"] = ({
        href,
        className,
        children: content,
        "aria-current": ac,
      }) =>
        isExternal ? (
          <a
            href={href}
            className={className}
            target="_blank"
            rel="noopener noreferrer"
            aria-current={ac}
          >
            {content}
          </a>
        ) : (
          <Link to={href} className={className} aria-current={ac}>
            {content}
          </Link>
        );
      return {
        key: `${item.href}-${j}`,
        label: item.label,
        icon: Icon ? <Icon size={16} /> : null,
        href: item.href,
        isActive,
        render,
      };
    }),
  }));

  return (
    <AppShell
      productKey="analytics"
      products={PRODUCTS}
      navGroups={navGroups}
      sidebarHeader={<WorkspaceSwitcher />}
      topbarStart={<Header />}
      sidebarFooter={
        <>
          <div>
            <div {...classes.orgLineStyle}>{ORG_NAME}</div>
            <div {...classes.appLineStyle}>{APP_NAME}</div>
          </div>
          <div {...classes.themeToggleStyle}>
            <Sun
              size={12}
              color={
                !isDark
                  ? "var(--operon-color-primary)"
                  : "var(--operon-color-text-subtle)"
              }
            />
            <Toggle size="sm" checked={isDark} onChange={toggleTheme} />
            <Moon
              size={12}
              color={
                isDark
                  ? "var(--operon-color-primary)"
                  : "var(--operon-color-text-subtle)"
              }
            />
          </div>
        </>
      }
      user={
        user
          ? { name: user.name || user.email || "Signed in", email: user.email }
          : undefined
      }
      onSignOut={async () => {
        await logout("/api/auth/logout");
        window.location.href = HOMEPAGE_URL;
      }}
      onSwitchProduct={(product) => {
        window.location.href = bridgeToken(product.url);
        return true;
      }}
      className={cx(classes.rootStyle.className)}
      style={classes.rootStyle.style}
    >
      {children}
    </AppShell>
  );
};
