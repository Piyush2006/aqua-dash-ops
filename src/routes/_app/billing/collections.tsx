import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { TrendArea } from "@/components/charts";
import { DataTable, Column } from "@/components/ui/data-table";
import { revenueTrend, outstandingAging, topDefaulters, formatCurrency } from "@/mocks/data";

export const Route = createFileRoute("/_app/billing/collections")({ component: Page });

function Page() {
  return (
    <>
      <PageHeader title="Collections" description="Receivables, aging buckets and follow-up actions" />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <KpiCard label="Collected (Nov)" value="₹4.21 Cr" trend={{ value: 8.2 }} />
        <KpiCard label="Target" value="₹4.10 Cr" />
        <KpiCard label="Outstanding" value="₹3.42 Cr" trend={{ value: -5.6 }} />
        <KpiCard label="Defaulters" value={topDefaulters.length.toString()} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Collection vs Outstanding (12 mo)</h3>
          <TrendArea data={revenueTrend} xKey="month" series={[
            { key: "collected", name: "Collected", color: "var(--color-success)" },
            { key: "outstanding", name: "Outstanding", color: "var(--color-warning)" },
          ]} height={240} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Aging Buckets</h3>
          <ul className="space-y-3">
            {outstandingAging.map((b) => (
              <li key={b.bucket}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{b.bucket}</span>
                  <span className="font-semibold tabular-nums">₹{b.amount}L</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${(b.amount / 142) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold">Top Defaulters</h3>
        <DataTable
          data={topDefaulters}
          rowKey={(r) => r.id}
          columns={[
            { key: "id", header: "ID", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
            { key: "name", header: "Consumer", accessor: (r) => <span className="font-medium">{r.name}</span> },
            { key: "flat", header: "Flat", accessor: (r) => r.flat },
            { key: "out", header: "Outstanding", accessor: (r) => <span className="font-semibold text-critical tabular-nums">{formatCurrency(r.outstanding)}</span>, sortValue: (r) => r.outstanding },
          ] as Column<typeof topDefaulters[number]>[]}
        />
      </div>
    </>
  );
}
