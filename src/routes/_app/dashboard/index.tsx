import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { TrendArea, BarsChart, Donut, TrendLine } from "@/components/charts";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  IndianRupee, Droplets, TrendingUp, Users, Gauge, AlertCircle, Activity, ShieldAlert, ArrowRight,
} from "lucide-react";
import {
  executiveKpis, revenueTrend, consumptionTrend, townshipComparison,
  outstandingAging, topConsumingTownships, topDefaulters, alerts,
  formatCurrency, formatNumber, collectionEfficiencyTrend,
} from "@/mocks/data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/dashboard/")({
  component: ExecutiveDashboard,
});

function ExecutiveDashboard() {
  return (
    <>
      <PageHeader
        title="Executive Dashboard"
        description="Operational, revenue and consumption pulse across all townships."
        actions={
          <>
            <Button variant="outline" size="sm">Last 30 days</Button>
            <Button size="sm">Generate report</Button>
          </>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard variant="primary" label={executiveKpis.revenue.label} value={formatCurrency(executiveKpis.revenue.value)} delta={executiveKpis.revenue.delta} icon={IndianRupee} sub="Nov billing cycle" />
        <KpiCard variant="accent" label={executiveKpis.consumption.label} value={formatNumber(executiveKpis.consumption.value)} delta={executiveKpis.consumption.delta} icon={Droplets} sub="Kilolitres" />
        <KpiCard variant="success" label={executiveKpis.collectionEfficiency.label + " %"} value={executiveKpis.collectionEfficiency.value + "%"} delta={executiveKpis.collectionEfficiency.delta} icon={TrendingUp} sub="Above 90% target" />
        <KpiCard label={executiveKpis.activeConsumers.label} value={formatNumber(executiveKpis.activeConsumers.value)} delta={executiveKpis.activeConsumers.delta} icon={Users} />
        <KpiCard label={executiveKpis.activeMeters.label} value={formatNumber(executiveKpis.activeMeters.value)} delta={executiveKpis.activeMeters.delta} icon={Gauge} />
        <KpiCard label={executiveKpis.outstanding.label} value={formatCurrency(executiveKpis.outstanding.value)} delta={executiveKpis.outstanding.delta} icon={IndianRupee} />
        <KpiCard label={executiveKpis.nrw.label + " %"} value={executiveKpis.nrw.value + "%"} delta={executiveKpis.nrw.delta} icon={Activity} />
        <KpiCard label={executiveKpis.faultyMeters.label} value={formatNumber(executiveKpis.faultyMeters.value)} delta={executiveKpis.faultyMeters.delta} icon={ShieldAlert} />
      </div>

      {/* Charts row 1 */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionHeader title="Revenue vs Collection" description="Monthly billed revenue against amount collected" actions={<StatusBadge status="Active" dot />} />
          <TrendArea data={revenueTrend} x="month" series={[
            { key: "revenue", label: "Billed (₹ Cr)" },
            { key: "collected", label: "Collected (₹ Cr)" },
          ]} height={280} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <SectionHeader title="Outstanding Aging" description="As of today" />
          <BarsChart data={outstandingAging} x="bucket" series={[{ key: "amount", label: "₹ L" }]} height={280} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionHeader title="Water Consumption Trend" description="Domestic, commercial, common-area usage" />
          <BarsChart data={consumptionTrend} x="month" stacked series={[
            { key: "domestic", label: "Domestic (KL)" },
            { key: "commercial", label: "Commercial (KL)" },
            { key: "common", label: "Common (KL)" },
          ]} height={260} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <SectionHeader title="Collection Efficiency" />
          <TrendLine data={collectionEfficiencyTrend} x="month" series={[{ key: "efficiency", label: "Efficiency %" }]} height={260} />
        </div>
      </div>

      {/* Township comparison + Top defaulters + Alerts */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionHeader title="Township Comparison" description="Revenue vs consumption" />
          <BarsChart data={townshipComparison} x="name" series={[
            { key: "revenue", label: "Revenue (₹ L)" },
            { key: "consumption", label: "Consumption (KL)" },
          ]} height={280} />
        </div>

        <div className="rounded-xl border bg-card shadow-card">
          <div className="flex items-center justify-between border-b p-4">
            <p className="text-sm font-semibold">Top consuming townships</p>
            <Link to="/analytics/consumption" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y">
            {topConsumingTownships.slice(0, 5).map((t, i) => (
              <div key={t.name} className="flex items-center gap-3 p-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">{i + 1}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(t.consumption)} KL · {t.efficiency}% efficiency</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-foreground">₹{t.revenue}L</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card shadow-card">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <p className="text-sm font-semibold">Top defaulters</p>
              <p className="text-xs text-muted-foreground">High outstanding consumers</p>
            </div>
            <Link to="/billing/collections" className="text-xs text-primary hover:underline">Open collections</Link>
          </div>
          <div className="divide-y">
            {topDefaulters.slice(0, 6).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-critical/10 text-xs font-semibold text-critical">{c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.id} · {c.flat}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-critical">{formatCurrency(c.outstanding)}</p>
                  <p className="text-[11px] text-muted-foreground">outstanding</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-card">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <p className="text-sm font-semibold">Active alerts</p>
              <p className="text-xs text-muted-foreground">Live across all townships</p>
            </div>
            <Link to="/meters/alerts" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="divide-y">
            {alerts.filter((a) => a.status !== "Resolved").slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${a.severity === "Critical" ? "bg-critical/10 text-critical" : a.severity === "High" ? "bg-warning/10 text-warning-foreground" : "bg-info-soft text-info"}`}>
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{a.type}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.source} · {a.township}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={a.severity} />
                  <span className="text-[11px] text-muted-foreground">{a.raisedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
