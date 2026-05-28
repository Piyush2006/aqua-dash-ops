import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, SectionHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { TrendLine, Donut, BarsChart } from "@/components/charts";
import { StatusBadge } from "@/components/ui/status-badge";
import { Gauge, WifiOff, AlertTriangle, Activity, CheckCircle2, BatteryLow, Signal } from "lucide-react";
import { meterHealth, readSuccessTrend, realtimeIngestion, meters, alerts, formatNumber } from "@/mocks/data";

export const Route = createFileRoute("/_app/dashboard/mdm")({ component: MdmDashboard });

function MdmDashboard() {
  const liveMeters = meters.slice(0, 8);
  return (
    <>
      <PageHeader title="MDM Operations" description="Real-time meter data management — ingestion, health, exceptions." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard variant="success" label="Active meters" value={formatNumber(17350)} delta={1.4} icon={CheckCircle2} />
        <KpiCard label="Offline meters" value={formatNumber(567)} delta={-3.2} icon={WifiOff} />
        <KpiCard label="Faulty meters" value="287" delta={-8.1} icon={AlertTriangle} />
        <KpiCard label="Missing reads (24h)" value="142" delta={4.5} icon={Activity} />
        <KpiCard variant="primary" label="Read success" value="96.4%" delta={0.8} icon={CheckCircle2} sub="Last 7 days" />
        <KpiCard label="Water loss (NRW)" value="14.8%" delta={-2.3} icon={Activity} />
        <KpiCard label="Low battery" value="142" delta={6.2} icon={BatteryLow} />
        <KpiCard label="Comm health" value="98.1%" delta={0.3} icon={Signal} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionHeader title="Real-time meter ingestion" description="Reads received per hour" actions={<StatusBadge status="Active" dot />} />
          <TrendLine data={realtimeIngestion} x="hour" series={[{ key: "reads", label: "Reads/hour" }]} height={240} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <SectionHeader title="Meter health" />
          <Donut data={meterHealth} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <SectionHeader title="Read success trend" />
          <BarsChart data={readSuccessTrend} x="day" series={[
            { key: "success", label: "Success %" },
            { key: "failed", label: "Failed %" },
          ]} height={240} />
        </div>
        <div className="rounded-xl border bg-card shadow-card">
          <div className="flex items-center justify-between border-b p-4">
            <p className="text-sm font-semibold">Alert feed</p>
            <Link to="/meters/alerts" className="text-xs text-primary hover:underline">All</Link>
          </div>
          <div className="max-h-[240px] divide-y overflow-y-auto">
            {alerts.slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-center gap-2 p-3 text-xs">
                <StatusBadge status={a.severity} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{a.type}</p>
                  <p className="truncate text-muted-foreground">{a.source}</p>
                </div>
                <span className="text-muted-foreground">{a.raisedAt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border bg-card shadow-card">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <p className="text-sm font-semibold">Live meter monitoring</p>
            <p className="text-xs text-muted-foreground">Real-time status, battery and connectivity</p>
          </div>
          <Link to="/meters" className="text-xs text-primary hover:underline">Open meter operations</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Meter ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Connectivity</th>
                <th className="px-4 py-3">Battery</th>
                <th className="px-4 py-3">Signal</th>
                <th className="px-4 py-3">Last read</th>
              </tr>
            </thead>
            <tbody>
              {liveMeters.map((m) => (
                <tr key={m.id} className="border-t hover:bg-surface">
                  <td className="px-4 py-2.5 font-mono text-xs">{m.id}</td>
                  <td className="px-4 py-2.5">{m.type}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={m.status} dot /></td>
                  <td className="px-4 py-2.5">{m.connectivity}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className={`h-full ${m.battery < 40 ? "bg-critical" : m.battery < 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${m.battery}%` }} />
                      </div>
                      <span className="text-xs tabular-nums">{m.battery}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">{m.signal}%</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{m.lastRead}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
