import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, IndianRupee, Clock, MessageSquare, Gauge, AlertTriangle, Check, CheckCheck } from "lucide-react";
import { portalNotifications, type PortalNotification } from "@/mocks/portal";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/portal/notifications")({ component: NotificationsPage });

const typeIcon: Record<PortalNotification["type"], any> = {
  Bill: IndianRupee,
  Reminder: Clock,
  Service: MessageSquare,
  Reading: Gauge,
  Alert: AlertTriangle,
};

const typeAccent: Record<PortalNotification["type"], string> = {
  Bill: "bg-primary/10 text-primary",
  Reminder: "bg-warning-soft text-warning-foreground",
  Service: "bg-info-soft text-info",
  Reading: "bg-muted text-muted-foreground",
  Alert: "bg-critical-soft text-critical",
};

const filters = ["All", "Bill", "Reminder", "Service", "Reading", "Alert"] as const;

function NotificationsPage() {
  const [items, setItems] = useState(portalNotifications);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visible = filter === "All" ? items : items.filter((n) => n.type === filter);
  const unread = items.filter((n) => !n.read).length;

  const markRead = (id: string) =>
    setItems(items.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        description={`${unread} unread of ${items.length}`}
        actions={
          unread > 0 ? (
            <Button size="sm" variant="outline" onClick={markAllRead}>
              <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
            </Button>
          ) : null
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="h-7 text-xs">
            {f}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border bg-card shadow-card">
        {visible.map((n, i) => {
          const Icon = typeIcon[n.type];
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-4 transition-colors",
                i !== visible.length - 1 && "border-b",
                !n.read && "bg-primary/5",
              )}
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", typeAccent[n.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm", n.read ? "font-medium text-foreground" : "font-semibold text-foreground")}>
                    {n.title}
                    {!n.read && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-primary align-middle" />}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">{n.at}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
              </div>
              {!n.read && (
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => markRead(n.id)}>
                  <Check className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          );
        })}
        {!visible.length && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <Bell className="mx-auto mb-2 h-6 w-6 opacity-50" />
            No notifications in this category
          </div>
        )}
      </div>
    </>
  );
}
