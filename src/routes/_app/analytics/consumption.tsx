import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { TrendArea } from "@/components/charts";
import { consumptionTrend, topConsumingTownships, formatNumber } from "@/mocks/data";

export const Route = createFileRoute("/_app/analytics/consumption")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Consumption Analytics" description="Domestic, commercial and common-area usage patterns" />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <KpiCard label="Total Consumption" value="28.45 ML" trend={{ value: 4.2 }} variant="gradient" />
        <KpiCard label="Per-capita (LPCD)" value="142 L" trend={{ value: -1.8 }} />
        <KpiCard label="Peak Hour" value="07:00 – 09:00" />
        <KpiCard label="Common Area %" value="11.4%" trend={{ value: 0.6 }} />
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <h3 className="mb-3 text-sm font-semibold">Consumption Mix (12 mo)</h3>
        <TrendArea data={consumptionTrend} xKey="month" series={[
          { key: "domestic", name: "Domestic", color: "var(--color-primary)" },
          { key: "commercial", name: "Commercial", color: "var(--color-accent)" },
          { key: "common", name: "Common", color: "var(--color-warning)" },
        ]} height={280} />
      </div>
      <div className="mt-4 rounded-xl border bg-card p-5 shadow-card">
        <h3 className="mb-3 text-sm font-semibold">Top Consuming Townships</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {topConsumingTownships.map((t) => (
            <div key={t.name} className="rounded-lg border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">{t.name}</span>
                <span className="text-sm font-semibold tabular-nums">{formatNumber(t.consumption)} KL</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div className="h-1.5 rounded-full gradient-primary" style={{ width: `${(t.consumption / 9200) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
