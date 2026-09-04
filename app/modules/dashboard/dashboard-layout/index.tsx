import { cx } from "@morph-css/kit";
import { useAuth } from "@operonstudio/auth";
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
import {
  ANALYTICS_URL,
  APP_NAME,
  CODEBLOCKS_URL,
  COMPOSE_URL,
  HOMEPAGE_URL,
  ORG_NAME,
} from "#/common/constants";
import type { SidebarGroup, SidebarItem } from "#/common/interfaces";
import { Header } from "#/components/header";
import { ScopeSwitcher } from "#/components/scope-switcher";
import { OnboardingGate } from "#/modules/onboarding";
import * as classes from "./style";

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

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const matches = useMatches();
  const matchWithSidebar = matches.find((m) => m.staticData?.sidebarGroups);
  const { sidebarGroups = [] } = matchWithSidebar?.staticData || {};
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const navGroups: AppShellNavGroup[] = sidebarGroups.map(
    (group: SidebarGroup, i: number) => ({
      key: `${group.title ?? "group"}-${i}`,
      title: group.title,
      items: group.items.map((item: SidebarItem, j: number) => {
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
    }),
  );

  return (
    <AppShell
      productKey="analytics"
      products={PRODUCTS}
      navGroups={navGroups}
      sidebarHeader={<ScopeSwitcher />}
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
        await logout();
        window.location.href = HOMEPAGE_URL;
      }}
      onSwitchProduct={(product) => {
        // Straight to the product. This used to append the session token to
        // the URL, which writes it into browser history, the referrer header
        // and every access log in between. The session cookie is scoped to the
        // domain, so the other product already has it.
        window.location.href = product.url;
        return true;
      }}
      className={cx(classes.rootStyle.className)}
      style={classes.rootStyle.style}
    >
      <OnboardingGate>{children}</OnboardingGate>
    </AppShell>
  );
};
