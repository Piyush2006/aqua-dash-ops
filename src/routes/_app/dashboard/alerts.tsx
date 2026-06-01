import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, AlertCircle, Info, CheckCircle2, User, Clock, Lightbulb, UserCircle2, Calendar } from "lucide-react";
import { alerts, alertCategories, type AlertCategory } from "@/mocks/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dashboard/alerts")({ component: AlertsDashboard });

function AlertsDashboard() {
  const [category, setCategory] = useState<"all" | AlertCategory>("all");
  const [status, setStatus] = useState<"all" | "Open" | "Acknowledged" | "Resolved">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => alerts.filter((a) => {
    if (category !== "all" && a.category !== category) return false;
    if (status !== "all" && a.status !== status) return false;
    if (from && a.createdDate < from) return false;
    if (to && a.createdDate > to) return false;
    return true;
  }), [category, status, from, to]);

  const grouped = {
    Critical: filtered.filter((a) => a.severity === "Critical"),
    High: filtered.filter((a) => a.severity === "High"),
    Medium: filtered.filter((a) => a.severity === "Medium"),
    Low: filtered.filter((a) => a.severity === "Low"),
  };

  return (
    <>
      <PageHeader title="Exception & Alert Management" description="Business-focused exceptions and operational alert workflow." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard variant="critical" label="Critical" value={grouped.Critical.length} icon={AlertTriangle} />
        <KpiCard variant="warning" label="High" value={grouped.High.length} icon={AlertCircle} />
        <KpiCard label="Medium" value={grouped.Medium.length} icon={Info} />
        <KpiCard variant="success" label="Resolved (24h)" value={filtered.filter(a => a.status === "Resolved").length} icon={CheckCircle2} />
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-xl border bg-card p-4 shadow-card">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
            <Select value={category} onValueChange={(v) => setCategory(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {alertCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">From</label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">To</label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-4">
        {(["Critical", "High", "Medium", "Low"] as const).map((sev) => (
          <div key={sev} className="rounded-xl border bg-card shadow-card">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={sev} />
                <span className="text-xs text-muted-foreground">{grouped[sev].length} items</span>
              </div>
            </div>
            <div className="max-h-[620px] space-y-2 overflow-y-auto p-3">
              {grouped[sev].slice(0, 10).map((a) => (
                <div key={a.id} className="rounded-lg border bg-card p-3 text-xs shadow-card transition-shadow hover:shadow-elevated">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{a.type}</p>
                      <p className="mt-0.5 truncate text-[11px] text-primary">{a.category}</p>
                    </div>
                    <StatusBadge status={a.status} dot />
                  </div>

                  <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5"><UserCircle2 className="h-3 w-3" />{a.consumerName} · <span className="font-mono">{a.source}</span></div>
                    <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{a.createdDate} · {a.township}</div>
                    <div className="flex items-center gap-1.5"><User className="h-3 w-3" />{a.assignee ?? "Unassigned"}</div>
                  </div>

                  <div className="mt-2 flex items-start gap-1.5 rounded-md bg-info-soft/60 p-2 text-[11px] text-foreground">
                    <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-info" />
                    <span><span className="font-medium">Recommended:</span> {a.recommendedAction}</span>
                  </div>

                  <div className="mt-3 flex gap-1.5">
                    <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={() => toast.success("Acknowledged")}>Acknowledge</Button>
                    <Button size="sm" className="h-7 flex-1 text-xs" onClick={() => toast.success(a.recommendedAction)}>Action</Button>
                  </div>
                </div>
              ))}
              {grouped[sev].length === 0 && (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">No alerts</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Workflow timeline */}
      <div className="mt-6 rounded-xl border bg-card p-5 shadow-card">
        <p className="mb-4 text-sm font-semibold">Alert workflow timeline</p>
        <div className="space-y-3">
          {[
            { time: "12:42", title: "Open: Reverse flow detected — MTR-050234", status: "Open" },
            { time: "12:18", title: "Acknowledged by Priya Sharma — MTR-050118", status: "Acknowledged" },
            { time: "11:55", title: "Acknowledged: Missing reading — MTR-050412", status: "Acknowledged" },
            { time: "10:24", title: "Resolved by field team — Leak repaired", status: "Resolved" },
            { time: "09:02", title: "Open: Abnormal consumption — MTR-050567", status: "Open" },
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
