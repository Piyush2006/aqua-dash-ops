import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, User, Clock } from "lucide-react";
import { alerts } from "@/mocks/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dashboard/alerts")({ component: AlertsDashboard });

function AlertsDashboard() {
  const grouped = {
    Critical: alerts.filter((a) => a.severity === "Critical"),
    High: alerts.filter((a) => a.severity === "High"),
    Medium: alerts.filter((a) => a.severity === "Medium"),
    Low: alerts.filter((a) => a.severity === "Low"),
  };

  return (
    <>
      <PageHeader title="Alerts Dashboard" description="Operational alert priority and workflow." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard variant="critical" label="Critical" value={grouped.Critical.length} icon={AlertTriangle} />
        <KpiCard variant="warning" label="High" value={grouped.High.length} icon={AlertCircle} />
        <KpiCard label="Medium" value={grouped.Medium.length} icon={Info} />
        <KpiCard variant="success" label="Resolved (24h)" value={18} icon={CheckCircle2} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-4">
        {(["Critical", "High", "Medium", "Low"] as const).map((sev) => (
          <div key={sev} className="rounded-xl border bg-card shadow-card">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={sev} />
                <span className="text-xs text-muted-foreground">{grouped[sev].length} open</span>
              </div>
            </div>
            <div className="max-h-[520px] space-y-2 overflow-y-auto p-3">
              {grouped[sev].slice(0, 8).map((a) => (
                <div key={a.id} className="rounded-lg border bg-card p-3 text-xs shadow-card transition-shadow hover:shadow-elevated">
                  <p className="text-sm font-medium text-foreground">{a.type}</p>
                  <p className="mt-0.5 text-muted-foreground">{a.source} · {a.township}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {a.raisedAt}
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  {a.assignee && (
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <User className="h-3 w-3" /> {a.assignee}
                    </div>
                  )}
                  <div className="mt-3 flex gap-1.5">
                    <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={() => toast.success("Acknowledged")}>Ack</Button>
                    <Button size="sm" className="h-7 flex-1 text-xs" onClick={() => toast.success("Assigned to you")}>Take</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Workflow timeline */}
      <div className="mt-6 rounded-xl border bg-card p-5 shadow-card">
        <p className="mb-4 text-sm font-semibold">Alert workflow timeline</p>
        <div className="space-y-3">
          {[
            { time: "12:42", title: "Critical: Reverse flow detected — MTR-050234", status: "Open" },
            { time: "12:18", title: "Acknowledged by Priya Sharma — MTR-050118", status: "Acknowledged" },
            { time: "11:55", title: "Assigned to field team — Block C", status: "In Progress" },
            { time: "10:24", title: "Resolved by field team — Leak repaired", status: "Resolved" },
            { time: "09:02", title: "High: Abnormal consumption — MTR-050567", status: "Open" },
          ].map((e, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="w-12 shrink-0 text-xs font-mono text-muted-foreground">{e.time}</span>
              <div className="relative w-px shrink-0 bg-border">
                <span className="absolute top-1.5 -left-[3px] h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <div className="flex flex-1 items-center justify-between gap-2 pb-1">
                <span className="text-foreground">{e.title}</span>
                <StatusBadge status={e.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
