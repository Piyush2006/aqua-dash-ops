import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, Gauge, Receipt, BarChart3, Settings,
  ChevronDown, ChevronsLeft, Droplets,
} from "lucide-react";

type Item = { title: string; to: string; icon?: any; children?: { title: string; to: string }[] };

const nav: Item[] = [
  {
    title: "Dashboard", to: "/dashboard", icon: LayoutDashboard,
    children: [
      { title: "Executive", to: "/dashboard" },
      { title: "MDM Operations", to: "/dashboard/mdm" },
      { title: "Billing", to: "/dashboard/billing" },
      { title: "Consumer 360", to: "/dashboard/consumer" },
      { title: "Alerts", to: "/dashboard/alerts" },
    ],
  },
  {
    title: "Customers", to: "/customers", icon: Users,
    children: [
      { title: "Consumers", to: "/customers" },
      { title: "Utility Owners", to: "/customers/utility-owners" },
      { title: "Admin Owners", to: "/customers/admin-owners" },
      { title: "Connections", to: "/customers/connections" },
      { title: "Requests", to: "/customers/requests" },
    ],
  },
  {
    title: "Meter Operations", to: "/meters", icon: Gauge,
    children: [
      { title: "Meters", to: "/meters" },
      { title: "Hierarchy", to: "/meters/hierarchy" },
      { title: "Read Cycles", to: "/meters/read-cycles" },
    ],
  },
  {
    title: "Billing & Payments", to: "/billing/tariffs", icon: Receipt,
    children: [
      { title: "Tariffs", to: "/billing/tariffs" },
      { title: "Bills", to: "/billing/bills" },
      { title: "Payments", to: "/billing/payments" },
      { title: "Collections", to: "/billing/collections" },
      { title: "Schedules", to: "/billing/schedules" },
    ],
  },
  {
    title: "Analytics", to: "/analytics/reports", icon: BarChart3,
    children: [
      { title: "Reports", to: "/analytics/reports" },
      { title: "Custom Reports", to: "/analytics/custom" },
    ],
  },
  {
    title: "Administration", to: "/admin/users", icon: Settings,
    children: [
      { title: "Users & Roles", to: "/admin/users" },
      { title: "Approvals", to: "/admin/approvals" },
      { title: "Audit Logs", to: "/admin/audit-logs" },
      { title: "Notifications", to: "/admin/notifications" },
      { title: "Holiday Calendar", to: "/admin/holidays" },
      { title: "System Settings", to: "/admin/settings" },
    ],
  },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(nav.map((g) => [g.title, nav.find((n) => n.title === g.title)?.children?.some((c) => pathname.startsWith(c.to)) ?? false]))
  );

  useEffect(() => {
    setOpenGroups((prev) => ({
      ...prev,
      ...Object.fromEntries(nav.map((g) => [g.title, prev[g.title] || (g.children?.some((c) => pathname === c.to || pathname.startsWith(c.to + "/")) ?? false)])),
    }));
  }, [pathname]);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-sidebar transition-[width] duration-200 ease-out",
        collapsed ? "w-[68px]" : "w-[244px]",
      )}
    >
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground shadow-card">
          <Droplets className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">AquaOps</p>
            <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">Smart Utility Platform</p>
          </div>
        )}
      </div>

      <nav className="scrollbar-thin flex-1 overflow-y-auto px-2 py-3">
        {nav.map((g) => {
          const isActive = g.children?.some((c) => pathname === c.to || pathname.startsWith(c.to + "/"));
          const open = openGroups[g.title];
          const Icon = g.icon;
          return (
            <div key={g.title} className="mb-0.5">
              <button
                onClick={() => setOpenGroups((s) => ({ ...s, [g.title]: !s[g.title] }))}
                className={cn(
                  "group flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
                title={collapsed ? g.title : undefined}
              >
                {Icon && <Icon className={cn("h-4.5 w-4.5 shrink-0", "h-4 w-4", isActive && "text-sidebar-primary")} />}
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{g.title}</span>
                    <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
                  </>
                )}
              </button>
              {!collapsed && open && g.children && (
                <div className="ml-2 mt-0.5 space-y-0.5 border-l pl-2">
                  {g.children.map((c) => {
                    const active = pathname === c.to;
                    return (
                      <Link
                        key={c.to}
                        to={c.to}
                        className={cn(
                          "block rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                          active
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        )}
                      >
                        {c.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button
        onClick={onToggle}
        className="flex h-11 items-center justify-center gap-2 border-t text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}
