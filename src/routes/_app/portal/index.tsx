import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { TrendArea } from "@/components/charts";
import {
  Droplets, IndianRupee, Calendar, Gauge, Bell, FileText, MessageSquare,
  User, MapPin, Hash, ArrowRight,
} from "lucide-react";
import {
  consumer, currentBill, consumptionHistory, currentMonthKL, previousMonthKL,
  averageKL, portalBills, portalRequests, portalNotifications, formatCurrency,
} from "@/mocks/portal";

export const Route = createFileRoute("/_app/portal/")({ component: PortalDashboard });

function PortalDashboard() {
  const delta = +(((currentMonthKL - previousMonthKL) / previousMonthKL) * 100).toFixed(1);
  return (
    <>
      <PageHeader
        title={`Welcome, ${consumer.name.split(" ")[0]}`}
        description="Your water account at a glance"
        actions={
          <Button size="sm" asChild>
            <Link to="/portal/bills"><IndianRupee className="mr-1.5 h-4 w-4" /> Pay current bill</Link>
          </Button>
        }
      />

      {/* Account summary card */}
      <div className="mb-6 rounded-xl border bg-card p-5 shadow-card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryItem icon={User} label="Consumer" value={consumer.name} sub={consumer.id} />
          <SummaryItem icon={Hash} label="Connection" value={consumer.connectionNo} sub={`Meter ${consumer.meterId}`} />
          <SummaryItem icon={MapPin} label="Service address" value={consumer.address} />
          <SummaryItem icon={Gauge} label="Tariff" value={consumer.tariff} sub={`Occupancy: ${consumer.occupancy}`} />
          <SummaryItem icon={Droplets} label="Connection status" value={<StatusBadge status={consumer.connectionStatus} dot />} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard variant="primary" label="Current month" value={`${currentMonthKL} KL`} delta={delta} icon={Droplets} sub={`vs ${previousMonthKL} KL last month`} />
        <KpiCard label="Average consumption" value={`${averageKL} KL`} icon={Gauge} sub="12-month rolling average" />
        <KpiCard variant={currentBill.status === "Overdue" ? "warning" : "default"} label="Current due" value={formatCurrency(currentBill.amount)} icon={IndianRupee} sub={`Due ${currentBill.dueDate}`} />
        <KpiCard label="Bill status" value={currentBill.status} icon={Calendar} sub={`Period ${currentBill.period}`} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionHeader title="Consumption trend" description="12-month view" />
          <TrendArea
            data={consumptionHistory}
            x="month"
            series={[
              { key: "consumption", label: "Consumption (KL)" },
              { key: "avg", label: "Average" },
            ]}
            height={260}
          />
        </div>

        <div className="space-y-4">
          {/* Recent bills */}
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Recent bills</p>
              <Link to="/portal/bills" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-2 text-xs">
              {portalBills.slice(0, 4).map((b) => (
                <div key={b.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{b.period}</p>
                    <p className="text-muted-foreground">{b.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums font-medium">{formatCurrency(b.amount)}</span>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent requests */}
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">Recent requests</p>
              <Link to="/portal/requests" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-2 text-xs">
              {portalRequests.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{r.subject}</p>
                    <p className="text-muted-foreground">{r.category} · {r.raisedAt}</p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications quick row */}
      <div className="mt-6 rounded-xl border bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">Recent notifications</p>
          </div>
          <Link to="/portal/notifications" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
            All notifications <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {portalNotifications.slice(0, 3).map((n) => (
            <div key={n.id} className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs font-semibold text-foreground">{n.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
              <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">{n.type} · {n.at}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SummaryItem({ icon: Icon, label, value, sub }: { icon: any; label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</div>
        {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}
