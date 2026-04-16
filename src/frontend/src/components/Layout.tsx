import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Briefcase,
  Building2,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogIn,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { Role } from "../types";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  roles?: Role[];
}

const CRM_ITEMS: NavItem[] = [
  {
    label: "Contacts",
    to: "/crm/contacts",
    icon: <Users className="size-4" />,
    roles: [Role.admin, Role.manager, Role.sales_rep],
  },
  {
    label: "Deals",
    to: "/crm/deals",
    icon: <Briefcase className="size-4" />,
    roles: [Role.admin, Role.manager, Role.sales_rep],
  },
  {
    label: "Activities",
    to: "/crm/activities",
    icon: <Activity className="size-4" />,
    roles: [Role.admin, Role.manager, Role.sales_rep],
  },
];

const ERP_ITEMS: NavItem[] = [
  {
    label: "Products",
    to: "/erp/products",
    icon: <Package className="size-4" />,
    roles: [Role.admin, Role.manager, Role.finance],
  },
  {
    label: "Purchase Orders",
    to: "/erp/purchase-orders",
    icon: <ShoppingCart className="size-4" />,
    roles: [Role.admin, Role.manager, Role.finance],
  },
  {
    label: "Invoices",
    to: "/erp/invoices",
    icon: <FileText className="size-4" />,
    roles: [Role.admin, Role.manager, Role.finance],
  },
  {
    label: "Financials",
    to: "/erp/financials",
    icon: <BarChart3 className="size-4" />,
    roles: [Role.admin, Role.manager, Role.finance],
  },
];

function canSee(item: NavItem, role: Role | null | undefined): boolean {
  if (!item.roles) return true;
  if (!role) return false;
  return item.roles.includes(role);
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      to={item.to as "/"}
      data-ocid={`sidebar.${item.label.toLowerCase().replace(/\s+/g, "_")}.link`}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
        active
          ? "bg-[oklch(var(--sidebar-accent))] text-[oklch(var(--sidebar-accent-foreground))]"
          : "text-[oklch(var(--sidebar-foreground)/0.65)] hover:text-[oklch(var(--sidebar-foreground))] hover:bg-[oklch(var(--sidebar-accent)/0.5)]",
      )}
    >
      <span className="shrink-0">{item.icon}</span>
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, principal, login, logout, isLoading, role } =
    useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  const principalText = principal?.toText() ?? "";
  const initials = principalText
    ? principalText.slice(0, 2).toUpperCase()
    : "?";
  const shortPrincipal = principalText
    ? `${principalText.slice(0, 6)}…${principalText.slice(-4)}`
    : "";

  const visibleCRM = CRM_ITEMS.filter((item) => canSee(item, role));
  const visibleERP = ERP_ITEMS.filter((item) => canSee(item, role));
  const showAdmin = role === Role.admin;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed left-0 top-0 h-full z-40 transition-smooth",
          "bg-[oklch(var(--sidebar))] border-r border-[oklch(var(--sidebar-border))]",
          collapsed ? "w-16" : "w-60",
        )}
        data-ocid="sidebar.panel"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[oklch(var(--sidebar-border))]">
          <div className="size-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 shadow-sm">
            <Building2 className="size-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-display font-bold text-base text-[oklch(var(--sidebar-foreground))] leading-none block truncate">
                BizCore
              </span>
              <span className="text-[10px] font-medium text-[oklch(var(--sidebar-foreground)/0.5)] tracking-widest uppercase leading-none block mt-0.5">
                ERP + CRM
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              "ml-auto size-6 rounded flex items-center justify-center",
              "text-[oklch(var(--sidebar-foreground)/0.4)] hover:text-[oklch(var(--sidebar-foreground))]",
              "transition-smooth",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            data-ocid="sidebar.collapse_toggle"
          >
            <ChevronRight
              className={cn(
                "size-4 transition-smooth",
                collapsed ? "" : "rotate-180",
              )}
            />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5">
          {/* Dashboard */}
          <div>
            <Link
              to="/dashboard"
              data-ocid="sidebar.dashboard.link"
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
                currentPath === "/dashboard"
                  ? "bg-[oklch(var(--sidebar-accent))] text-[oklch(var(--sidebar-accent-foreground))]"
                  : "text-[oklch(var(--sidebar-foreground)/0.65)] hover:text-[oklch(var(--sidebar-foreground))] hover:bg-[oklch(var(--sidebar-accent)/0.5)]",
              )}
            >
              <LayoutDashboard className="size-4 shrink-0" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </div>

          {/* CRM */}
          {visibleCRM.length > 0 && (
            <div>
              {!collapsed && (
                <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[oklch(var(--sidebar-foreground)/0.35)] mb-1.5">
                  CRM
                </p>
              )}
              <div className="space-y-0.5">
                {visibleCRM.map((item) => (
                  <NavLink
                    key={item.to}
                    item={item}
                    active={currentPath.startsWith(item.to)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ERP */}
          {visibleERP.length > 0 && (
            <div>
              {!collapsed && (
                <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[oklch(var(--sidebar-foreground)/0.35)] mb-1.5">
                  ERP
                </p>
              )}
              <div className="space-y-0.5">
                {visibleERP.map((item) => (
                  <NavLink
                    key={item.to}
                    item={item}
                    active={currentPath.startsWith(item.to)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Admin */}
          {showAdmin && (
            <div>
              {!collapsed && (
                <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[oklch(var(--sidebar-foreground)/0.35)] mb-1.5">
                  Admin
                </p>
              )}
              <div className="space-y-0.5">
                <Link
                  to="/admin"
                  data-ocid="sidebar.admin.link"
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
                    currentPath === "/admin"
                      ? "bg-[oklch(var(--sidebar-accent))] text-[oklch(var(--sidebar-accent-foreground))]"
                      : "text-[oklch(var(--sidebar-foreground)/0.65)] hover:text-[oklch(var(--sidebar-foreground))] hover:bg-[oklch(var(--sidebar-accent)/0.5)]",
                  )}
                >
                  <Settings className="size-4 shrink-0" />
                  {!collapsed && <span>Admin</span>}
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* User footer */}
        <div className="p-2 border-t border-[oklch(var(--sidebar-border))]">
          {isAuthenticated ? (
            <div
              className={cn(
                "flex items-center gap-2.5 px-2 py-2 rounded-lg",
                !collapsed && "justify-between",
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="size-7 shrink-0">
                  <AvatarFallback className="bg-[oklch(var(--sidebar-primary))] text-[oklch(var(--sidebar-primary-foreground))] text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[oklch(var(--sidebar-foreground))] truncate">
                      {shortPrincipal}
                    </p>
                    <p className="text-[10px] text-[oklch(var(--sidebar-foreground)/0.5)] capitalize">
                      {role ?? "No role"}
                    </p>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={logout}
                data-ocid="sidebar.logout.button"
                className="shrink-0 size-7 flex items-center justify-center rounded text-[oklch(var(--sidebar-foreground)/0.4)] hover:text-[oklch(var(--sidebar-foreground))] transition-smooth"
                aria-label="Sign out"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoading}
              data-ocid="sidebar.login.button"
              className={cn("w-full gap-2", collapsed && "px-2")}
            >
              <LogIn className="size-4 shrink-0" />
              {!collapsed && (isLoading ? "Signing in…" : "Sign in")}
            </Button>
          )}
        </div>
      </aside>

      {/* Main area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-smooth",
          collapsed ? "md:pl-16" : "md:pl-60",
        )}
      >
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 bg-[oklch(var(--sidebar))] border-b border-[oklch(var(--sidebar-border))] px-4 py-3 flex items-center gap-3">
          <div className="size-7 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Building2 className="size-3.5 text-white" />
          </div>
          <span className="font-display font-bold text-base text-[oklch(var(--sidebar-foreground))]">
            BizCore
          </span>
          <div className="ml-auto flex items-center gap-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={logout}
                className="text-[oklch(var(--sidebar-foreground)/0.5)] hover:text-[oklch(var(--sidebar-foreground))]"
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoading}
                data-ocid="mobile.login.button"
              >
                Sign in
              </Button>
            )}
          </div>
        </header>

        {/* Mobile nav row */}
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto px-3 py-2 bg-card border-b border-border">
          <Link
            to="/dashboard"
            className="shrink-0 px-2.5 py-1.5 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          >
            Dashboard
          </Link>
          <Separator orientation="vertical" className="h-4" />
          {visibleCRM.map((item) => (
            <Link
              key={item.to}
              to={item.to as "/"}
              className="shrink-0 px-2.5 py-1.5 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              {item.label}
            </Link>
          ))}
          {visibleERP.map((item) => (
            <Link
              key={item.to}
              to={item.to as "/"}
              className="shrink-0 px-2.5 py-1.5 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Page content */}
        <main className="flex-1 bg-background">{children}</main>

        {/* Footer */}
        <footer className="bg-muted/40 border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
