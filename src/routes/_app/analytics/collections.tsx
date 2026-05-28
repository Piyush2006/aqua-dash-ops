import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { TrendArea } from "@/components/charts";
import { revenueTrend, outstandingAging } from "@/mocks/data";

export const Route = createFileRoute("/_app/analytics/collections")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Collection Analytics" description="Receivables, recovery rate and aging insights" />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <KpiCard label="Collection Eff." value="94.6%" delta={1.8} variant="primary" />
        <KpiCard label="DSO" value="18.4 days" delta={-2.1} />
        <KpiCard label="Recovered" value="₹4.21 Cr" delta={8.2} />
        <KpiCard label="Bad Debt" value="₹12.4 L" delta={-4.5} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Collection vs Billed</h3>
          <TrendArea data={revenueTrend} x="month" series={[
            { key: "revenue", label: "Billed", color: "var(--color-primary)" },
            { key: "collected", label: "Collected", color: "var(--color-success)" },
          ]} height={260} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Aging Buckets</h3>
          <ul className="space-y-3">
            {outstandingAging.map((b) => (
              <li key={b.bucket}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">{b.bucket}</span>
                  <span className="font-semibold tabular-nums">₹{b.amount}L</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full gradient-primary" style={{ width: `${(b.amount / 142) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
