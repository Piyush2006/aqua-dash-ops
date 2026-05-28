import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { Donut, TrendArea } from "@/components/charts";
import { meterHealth, readSuccessTrend } from "@/mocks/data";

export const Route = createFileRoute("/_app/analytics/meters")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Meter Reports" description="Fleet performance, exceptions and read quality" />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <KpiCard label="Active Meters" value="18,204" trend={{ value: 1.4 }} />
        <KpiCard label="Read Success" value="97.8%" trend={{ value: 0.6 }} variant="gradient" />
        <KpiCard label="Faulty" value="287" trend={{ value: -8.1 }} />
        <KpiCard label="Avg Battery" value="78%" trend={{ value: -1.2 }} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Fleet Health</h3>
          <Donut data={meterHealth} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Read Success Trend</h3>
          <TrendArea data={readSuccessTrend} xKey="day" series={[{ key: "success", name: "Success", color: "var(--color-success)" }]} height={240} />
        </div>
      </div>
    </>
  );
}
