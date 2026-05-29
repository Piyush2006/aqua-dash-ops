import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendLine } from "@/components/charts";
import { meters, townships, customerConsumption, alerts, auditLog, customers } from "@/mocks/data";
import { ArrowLeft, Battery, Wifi, Activity, Signal, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/meters/$id")({ component: MeterDetail });

function MeterDetail() {
  const { id } = useParams({ from: "/_app/meters/$id" });
  const m = meters.find((x) => x.id === id) ?? meters[0];
  const tw = townships.find((t) => t.id === m.townshipId)!;

  const readings = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    flow: Math.round(40 + Math.sin(i / 3) * 30 + Math.random() * 20),
  }));

  return (
    <>
      <Link to="/meters" className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Back to meters</Link>
      <PageHeader
        title={m.id}
        description={`${m.type} · ${tw.name} · ${m.flat}`}
        actions={<><StatusBadge status={m.status} dot /><Button variant="outline" size="sm">Force read</Button><Button size="sm">Configure</Button></>}
      />

      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Battery" value={`${m.battery}%`} icon={Battery} sub={m.battery < 40 ? "Replace soon" : "Healthy"} />
        <KpiCard label="Signal" value={`${m.signal}%`} icon={Signal} sub={m.connectivity} />
        <KpiCard label="Today's flow" value="412 L" icon={Activity} delta={3.2} />
        <KpiCard label="Last comm" value={m.lastRead} icon={Wifi} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-surface">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="readings">Readings</TabsTrigger>
          <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
          <TabsTrigger value="assignment">Consumer Assignment</TabsTrigger>
          <TabsTrigger value="comms">Communication Logs</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
              <p className="mb-3 text-sm font-semibold">Live flow (last 24h)</p>
              <TrendLine data={readings} x="hour" series={[{ key: "flow", label: "L/hour" }]} height={260} />
            </div>
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <p className="mb-4 text-sm font-semibold">Meter info</p>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Serial</dt><dd className="font-mono text-xs">{m.serial}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Install date</dt><dd>{m.installDate}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Connectivity</dt><dd>{m.connectivity}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Parent</dt><dd className="font-mono text-xs">Block-{m.flat[0]}-Bulk</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Customer</dt><dd className="font-mono text-xs">{m.customerId}</dd></div>
              </dl>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="readings" className="mt-4">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <TrendLine data={customerConsumption} x="month" series={[{ key: "consumption", label: "Consumption (KL)" }]} height={280} />
          </div>
        </TabsContent>

        <TabsContent value="comms" className="mt-4">
          <div className="rounded-xl border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs uppercase text-muted-foreground"><tr>
                <th className="px-4 py-3">Time</th><th className="px-4 py-3">Event</th><th className="px-4 py-3">RSSI</th><th className="px-4 py-3">Status</th>
              </tr></thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-2.5 font-mono text-xs">{`2025-11-28 ${String(23 - i).padStart(2, "0")}:${String(i * 7 % 60).padStart(2, "0")}`}</td>
                    <td className="px-4 py-2.5">Read uplink</td>
                    <td className="px-4 py-2.5 tabular-nums">{-(60 + i * 2)} dBm</td>
                    <td className="px-4 py-2.5"><StatusBadge status="Success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <div className="rounded-xl border bg-card shadow-card">
            <div className="divide-y">
              {alerts.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 text-sm">
                  <StatusBadge status={a.severity} />
                  <div className="flex-1"><p className="font-medium">{a.type}</p><p className="text-xs text-muted-foreground">{a.raisedAt}</p></div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-4">
          <div className="rounded-xl border bg-card p-5 shadow-card text-sm">
            <ul className="space-y-3">
              {["Manufactured · 2023-01-12", "Provisioned · 2023-03-04", "Installed · " + m.installDate, "First read · " + m.installDate, "Last calibration · 2025-08-15"].map((e, i) => (
                <li key={i} className="flex gap-3"><span className="h-2 w-2 mt-1.5 shrink-0 rounded-full bg-primary" /><span>{e}</span></li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="topology" className="mt-4">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <p className="text-sm">Township → Block → Cluster → This meter (Flat {m.flat})</p>
            <p className="mt-2 text-xs text-muted-foreground">See Meter Hierarchy for full visualization.</p>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="space-y-3">
              {auditLog.slice(0, 6).map((a) => (
                <div key={a.id} className="flex gap-3 text-sm">
                  <span className="w-24 shrink-0 text-xs font-mono text-muted-foreground">{a.timestamp}</span>
                  <span className="flex-1">{a.actor} {a.action} {a.entity}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
