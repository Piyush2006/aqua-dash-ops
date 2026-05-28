import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { TrendArea, TrendLine } from "@/components/charts";
import { revenueTrend, topConsumingTownships, formatCurrency } from "@/mocks/data";

export const Route = createFileRoute("/_app/analytics/revenue")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Revenue Analytics" description="Revenue, collection and ARPU trends across the portfolio" />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <KpiCard label="YTD Revenue" value="₹48.72 Cr" delta={12.4} variant="primary" />
        <KpiCard label="Avg ARPU" value="₹2,890" delta={3.6} />
        <KpiCard label="Collection Eff." value="94.6%" delta={1.8} />
        <KpiCard label="Outstanding" value="₹3.84 Cr" delta={-5.6} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Revenue Trend (12 mo)</h3>
          <TrendArea data={revenueTrend} x="month" series={[
            { key: "revenue", label: "Billed", color: "var(--color-primary)" },
            { key: "collected", label: "Collected", color: "var(--color-success)" },
          ]} height={260} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Revenue by Township</h3>
          <ul className="divide-y">
            {topConsumingTownships.map((t) => (
              <li key={t.name} className="flex items-center justify-between py-2.5 text-sm">
                <span className="truncate font-medium">{t.name}</span>
                <span className="font-semibold tabular-nums">{formatCurrency(t.revenue * 100000)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Collection Run Rate</h3>
          <TrendLine data={revenueTrend} x="month" series={[{ key: "collected", label: "Collected", color: "var(--color-accent)" }]} height={220} />
        </div>
      </div>
    </>
  );
}
