import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { TrendArea, BarsChart } from "@/components/charts";
import { StatusBadge } from "@/components/ui/status-badge";
import { Receipt, FileWarning, AlertTriangle, CheckCircle2, IndianRupee, RotateCcw } from "lucide-react";
import { bills, billingFunnel, revenueTrend, formatCurrency, formatNumber, topDefaulters } from "@/mocks/data";

export const Route = createFileRoute("/_app/dashboard/billing")({ component: BillingDashboard });

function BillingDashboard() {
  const recent = bills.slice(0, 6);
  return (
    <>
      <PageHeader title="Billing Dashboard" description="Bill generation, collections and payment performance." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard variant="primary" label="Bills generated" value={formatNumber(8040)} delta={2.4} icon={Receipt} sub="Nov 2025" />
        <KpiCard label="Pending bills" value="412" delta={-12.1} icon={FileWarning} />
        <KpiCard label="Overdue bills" value="186" delta={3.4} icon={AlertTriangle} />
        <KpiCard variant="success" label="Payment success" value="97.2%" delta={1.1} icon={CheckCircle2} />
        <KpiCard label="Collection amount" value={formatCurrency(4_22_50_000)} delta={8.6} icon={IndianRupee} />
        <KpiCard label="Rebilled cases" value="34" delta={-5.4} icon={RotateCcw} />
        <KpiCard label="Avg bill amount" value={formatCurrency(2140)} delta={1.8} />
        <KpiCard label="Days to pay (avg)" value="6.4" delta={-0.8} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionHeader title="Payment trend" description="Billed vs collected this year" />
          <TrendArea data={revenueTrend} x="month" series={[
            { key: "revenue", label: "Billed (₹ Cr)" },
            { key: "collected", label: "Collected (₹ Cr)" },
          ]} height={280} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <SectionHeader title="Billing funnel" />
          <BarsChart data={billingFunnel} x="stage" series={[{ key: "count", label: "Count" }]} height={280} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card shadow-card">
          <div className="flex items-center justify-between border-b p-4">
            <p className="text-sm font-semibold">Recent bill generations</p>
            <Link to="/billing/bills" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y">
            {recent.map((b) => (
              <div key={b.id} className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{b.id}</p>
                  <p className="truncate text-xs text-muted-foreground">{b.customerName} · {b.period}</p>
                </div>
                <StatusBadge status={b.status} />
                <p className="w-20 text-right text-sm font-semibold tabular-nums">{formatCurrency(b.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-card">
          <div className="flex items-center justify-between border-b p-4">
            <p className="text-sm font-semibold">Top overdue customers</p>
            <Link to="/billing/collections" className="text-xs text-primary hover:underline">Collections</Link>
          </div>
          <div className="divide-y">
            {topDefaulters.slice(0, 6).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-critical/10 text-xs font-semibold text-critical">{c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.id}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-critical">{formatCurrency(c.outstanding)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
