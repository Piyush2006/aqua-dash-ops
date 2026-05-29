import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Play, Plus, Gauge } from "lucide-react";
import { readCycles, formatNumber } from "@/mocks/data";
import { toast } from "sonner";
import { KpiCard } from "@/components/ui/kpi-card";
import { ReadCycleBuilderDialog } from "@/components/meters/ReadCycleBuilderDialog";

export const Route = createFileRoute("/_app/meters/read-cycles")({ component: Page });

function Page() {
  const totalMeters = readCycles.reduce((a, c) => a + c.meters, 0);
  const cols: Column<typeof readCycles[number]>[] = [
    { key: "id", header: "Cycle", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "name", header: "Name", accessor: (r) => <span className="font-medium">{r.name}</span>, sortValue: (r) => r.name },
    { key: "frequency", header: "Frequency", accessor: (r) => <span className="rounded-md bg-info-soft px-2 py-0.5 text-xs font-medium text-info">{r.frequency}</span> },
    { key: "meters", header: "Meters", accessor: (r) => <span className="tabular-nums">{formatNumber(r.meters)}</span>, sortValue: (r) => r.meters },
    { key: "lastRun", header: "Last Run", accessor: (r) => <span className="text-muted-foreground">{r.lastRun}</span> },
    { key: "nextRun", header: "Next Run", accessor: (r) => <span className="font-medium">{r.nextRun}</span> },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
    { key: "actions", header: "", accessor: (r) => (
      <Button size="sm" variant="outline" className="h-7" onClick={(e) => { e.stopPropagation(); toast.success(`${r.name} triggered`); }}><Play className="mr-1 h-3 w-3" /> Run now</Button>
    ) },
  ];
  return (
    <>
      <PageHeader title="Meter Read Cycles" description="Group meters and schedule reading collection" actions={
        <ReadCycleBuilderDialog trigger={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New cycle</Button>} />
      } />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiCard label="Total Meters" value={formatNumber(totalMeters)} icon={Gauge} />
        <KpiCard label="Scheduled Reads" value={formatNumber(totalMeters)} />
        <KpiCard variant="success" label="Completed" value={formatNumber(Math.round(totalMeters * 0.94))} />
        <KpiCard label="Pending" value={formatNumber(Math.round(totalMeters * 0.05))} />
        <KpiCard label="Failed" value={formatNumber(Math.round(totalMeters * 0.01))} />
      </div>

      <DataTable data={readCycles} columns={cols} rowKey={(r) => r.id} />
    </>
  );
}
