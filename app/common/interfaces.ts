import type { IconProps } from "@operonstudio/icons";

export interface SidebarItem {
  label: string;
  icon: React.ComponentType<IconProps>;
  href: string;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export interface PageHeaderData {
  title: string;
  subtitle: string;
  actions?: PageHeaderAction[];
}

export interface PageHeaderAction {
  id: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  variant: "primary" | "secondary";
}
