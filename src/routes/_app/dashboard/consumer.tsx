import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { TrendArea } from "@/components/charts";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Droplets, IndianRupee, AlertCircle, Download, Gauge } from "lucide-react";
import { customers, customerConsumption, formatCurrency } from "@/mocks/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dashboard/consumer")({ component: ConsumerDashboard });

function ConsumerDashboard() {
  const c = customers[0];
  return (
    <>
      <PageHeader
        title="Consumer 360"
        description={`Real-time view for ${c.name} · ${c.flat}`}
        actions={<Button onClick={() => toast.success("Invoice downloaded")} variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Download invoice</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard variant="primary" label="This month consumption" value="28.4 KL" delta={4.2} icon={Droplets} sub="vs 27.2 KL last month" />
        <KpiCard label="Last bill amount" value={formatCurrency(2140)} delta={3.1} icon={IndianRupee} sub="Paid on 12 Nov" />
        <KpiCard variant={c.outstanding > 0 ? "warning" : "success"} label="Outstanding" value={formatCurrency(c.outstanding)} icon={IndianRupee} sub={c.outstanding > 0 ? "Due in 4 days" : "No dues"} />
        <KpiCard label="Meter status" value={c.meterStatus} icon={Gauge} sub={`Last read ${c.lastReading} L`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionHeader title="Consumption trend" description="12 month consumption and bill amount" />
          <TrendArea data={customerConsumption} x="month" series={[
            { key: "consumption", label: "Consumption (KL)" },
            { key: "bill", label: "Bill (₹)" },
          ]} height={280} />
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <p className="text-sm font-semibold">Leak alerts</p>
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-warning-soft p-3 text-xs">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
              <div>
                <p className="font-medium text-warning-foreground">Continuous flow detected</p>
                <p className="mt-0.5 text-warning-foreground/80">Possible leak observed between 02:00-04:00 on 24 Nov.</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <p className="mb-3 text-sm font-semibold">Payment history</p>
            <div className="space-y-2 text-xs">
              {["Nov 2025", "Oct 2025", "Sep 2025", "Aug 2025"].map((m, i) => (
                <div key={m} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{m}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium tabular-nums">{formatCurrency(2140 - i * 80)}</span>
                    <StatusBadge status="Paid" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
