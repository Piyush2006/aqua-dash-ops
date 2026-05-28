import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { TrendLine, Donut } from "@/components/charts";
import { collectionEfficiencyTrend } from "@/mocks/data";

export const Route = createFileRoute("/_app/analytics/water-loss")({ component: Page });

const loss = [
  { name: "Physical Leakage", value: 6.4, color: "var(--color-critical)" },
  { name: "Apparent (metering)", value: 4.8, color: "var(--color-warning)" },
  { name: "Unauthorized Use", value: 2.1, color: "var(--color-accent)" },
  { name: "Authorized Unbilled", value: 1.5, color: "var(--color-muted-foreground)" },
];

function Page() {
  return (
    <>
      <PageHeader title="Water Loss / NRW" description="Non-revenue water breakdown and trends" />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <KpiCard label="NRW %" value="14.8%" delta={-2.3} variant="primary" />
        <KpiCard label="Physical Loss" value="6.4%" delta={-1.1} />
        <KpiCard label="Apparent Loss" value="4.8%" delta={-0.6} />
        <KpiCard label="Loss Cost (est.)" value="₹62.4 L" delta={-8.4} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Loss Breakdown</h3>
          <Donut data={loss} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">NRW Trend</h3>
          <TrendLine data={collectionEfficiencyTrend.map((d) => ({ ...d, nrw: 22 - d.efficiency * 0.1 }))} x="month" series={[{ key: "nrw", label: "NRW %", color: "var(--color-critical)" }]} height={240} />
        </div>
      </div>
    </>
  );
}

function Page2() { return null; }
void Page2;
