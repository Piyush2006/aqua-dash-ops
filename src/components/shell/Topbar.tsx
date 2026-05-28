import { useRouterState, Link } from "@tanstack/react-router";
import { Search, Bell, AlertTriangle, Calendar, Plus, ChevronDown, LogOut, User, Settings as SettingsIcon, Building2, Home as HomeIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { tenants, townships, notifications, alerts } from "@/mocks/data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/status-badge";

function useBreadcrumbs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const segs = path.split("/").filter(Boolean);
  return segs.map((s, i) => ({
    label: s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    to: "/" + segs.slice(0, i + 1).join("/"),
  }));
}

export function Topbar() {
  const crumbs = useBreadcrumbs();
  const [tenant, setTenant] = useState(tenants[0].id);
  const [township, setTownship] = useState("all");
  const unread = notifications.length;
  const openAlerts = alerts.filter((a) => a.status === "Open").length;

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="hidden min-w-0 items-center gap-1.5 text-xs text-muted-foreground md:flex">
          <Link to="/dashboard" className="hover:text-foreground"><HomeIcon className="h-3.5 w-3.5" /></Link>
          {crumbs.map((c, i) => (
            <span key={c.to} className="flex items-center gap-1.5">
              <span className="text-border">/</span>
              <span className={cn(i === crumbs.length - 1 ? "font-medium text-foreground" : "")}>{c.label}</span>
            </span>
          ))}
        </div>

        <div className="relative ml-auto hidden w-72 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers, meters, bills..." className="h-9 pl-9 text-sm" />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">⌘K</kbd>
        </div>

        {/* Tenant selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden gap-1.5 lg:flex">
              <Building2 className="h-3.5 w-3.5" />
              <span className="max-w-[120px] truncate text-xs">{tenants.find((t) => t.id === tenant)?.name}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tenant</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tenants.map((t) => (
              <DropdownMenuItem key={t.id} onClick={() => setTenant(t.id)}>{t.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden gap-1.5 lg:flex">
              <span className="max-w-[140px] truncate text-xs">{township === "all" ? "All townships" : townships.find((t) => t.id === township)?.name}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Township</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTownship("all")}>All townships</DropdownMenuItem>
            {townships.map((t) => (
              <DropdownMenuItem key={t.id} onClick={() => setTownship(t.id)}>{t.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="hidden gap-1.5 lg:flex">
          <Calendar className="h-3.5 w-3.5" />
          <span className="text-xs">Last 30 days</span>
          <ChevronDown className="h-3 w-3" />
        </Button>

        {/* Alerts */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-9 w-9">
              <AlertTriangle className="h-4 w-4" />
              {openAlerts > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-critical px-1 text-[10px] font-semibold text-critical-foreground">{openAlerts}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b p-3">
              <p className="text-sm font-semibold">Open Alerts</p>
              <Link to="/meters/alerts" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="max-h-80 divide-y overflow-y-auto">
              {alerts.filter((a) => a.status === "Open").slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-2 p-3 text-xs hover:bg-surface">
                  <StatusBadge status={a.severity} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{a.type}</p>
                    <p className="truncate text-muted-foreground">{a.source} · {a.township}</p>
                  </div>
                  <span className="shrink-0 text-muted-foreground">{a.raisedAt}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4" />
              {unread > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">{unread}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b p-3">
              <p className="text-sm font-semibold">Notifications</p>
              <button className="text-xs text-primary hover:underline" onClick={() => toast.success("All marked as read")}>Mark all read</button>
            </div>
            <div className="max-h-80 divide-y overflow-y-auto">
              {notifications.map((n) => (
                <div key={n.id} className="p-3 hover:bg-surface">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Quick actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quick actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/customers/new">Add Customer</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("Add meter dialog opened")}>Add Meter</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("Bill generation started for 8,040 customers")}>Generate Bill</DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/billing/tariffs">Create Tariff</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("CSV upload accepted: 1,240 reads queued")}>Upload Meter Reads</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-surface">
              <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-primary-foreground">AK</div>
              <div className="hidden text-left text-xs lg:block">
                <p className="font-medium text-foreground">Arjun Krishnan</p>
                <p className="text-muted-foreground">Super Admin</p>
              </div>
              <ChevronDown className="hidden h-3 w-3 text-muted-foreground lg:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Arjun Krishnan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="mr-2 h-3.5 w-3.5" /> Profile</DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/admin/settings"><SettingsIcon className="mr-2 h-3.5 w-3.5" /> Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/login"><LogOut className="mr-2 h-3.5 w-3.5" /> Sign out</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
