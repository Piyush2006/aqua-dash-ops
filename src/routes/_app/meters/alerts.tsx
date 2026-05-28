import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { alerts } from "@/mocks/data";

export const Route = createFileRoute("/_app/meters/alerts")({ component: Page });

function Page() {
  const meterAlerts = alerts.filter((a) => ["Meter Offline", "Leakage Detected", "Reverse Flow", "Low Battery", "Abnormal Consumption"].includes(a.type));
  const cols: Column<typeof alerts[number]>[] = [
    { key: "id", header: "Alert", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "severity", header: "Severity", accessor: (r) => <StatusBadge status={r.severity} /> },
    { key: "type", header: "Type", accessor: (r) => <span className="font-medium">{r.type}</span>, sortValue: (r) => r.type },
    { key: "source", header: "Meter", accessor: (r) => <span className="font-mono text-xs">{r.source}</span> },
    { key: "township", header: "Township", accessor: (r) => <span className="text-xs text-muted-foreground">{r.township}</span> },
    { key: "raisedAt", header: "Raised", accessor: (r) => r.raisedAt },
    { key: "assignee", header: "Assignee", accessor: (r) => r.assignee ?? <span className="text-muted-foreground">Unassigned</span> },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
  ];
  return (
    <>
      <PageHeader title="Meter Alerts" description={`${meterAlerts.length} meter-level alerts in scope`} />
      <DataTable data={meterAlerts} columns={cols} rowKey={(r) => r.id} searchKeys={["type", "source"]} />
    </>
  );
}
