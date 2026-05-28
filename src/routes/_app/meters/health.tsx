import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { Donut, TrendArea, TrendLine } from "@/components/charts";
import { meterHealth, readSuccessTrend, realtimeIngestion } from "@/mocks/data";

export const Route = createFileRoute("/_app/meters/health")({ component: Page });

function Page() {
  const total = meterHealth.reduce((s, x) => s + x.value, 0);
  const active = meterHealth.find((x) => x.name === "Active")?.value ?? 0;
  return (
    <>
      <PageHeader title="Meter Health" description="Real-time fleet diagnostics and connectivity status" />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <KpiCard label="Total Meters" value={total.toLocaleString("en-IN")} />
        <KpiCard label="Online %" value={`${((active / total) * 100).toFixed(1)}%`} trend={{ value: 0.8 }} />
        <KpiCard label="Avg Battery" value="78%" trend={{ value: -1.2 }} />
        <KpiCard label="Avg Signal (RSSI)" value="-72 dBm" trend={{ value: 2.1 }} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Health Distribution</h3>
          <Donut data={meterHealth} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Read Success (14 days)</h3>
          <TrendArea data={readSuccessTrend} xKey="day" series={[{ key: "success", name: "Success %", color: "var(--color-success)" }, { key: "failed", name: "Failed %", color: "var(--color-critical)" }]} height={220} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-3">
          <h3 className="mb-3 text-sm font-semibold">Real-time Ingestion (24h)</h3>
          <TrendLine data={realtimeIngestion} xKey="hour" series={[{ key: "reads", name: "Reads/hr", color: "var(--color-primary)" }]} height={220} />
        </div>
      </div>
    </>
  );
}
