import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { readExceptions } from "@/mocks/data";

export const Route = createFileRoute("/_app/meters/read-exceptions")({ component: Page });

function Page() {
  const cols: Column<typeof readExceptions[number]>[] = [
    { key: "id", header: "Exception", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "meterId", header: "Meter", accessor: (r) => <span className="font-mono text-xs">{r.meterId}</span> },
    { key: "type", header: "Type", accessor: (r) => <span className="font-medium">{r.type}</span>, sortValue: (r) => r.type },
    { key: "severity", header: "Severity", accessor: (r) => <StatusBadge status={r.severity} /> },
    { key: "detectedAt", header: "Detected", accessor: (r) => r.detectedAt },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
  ];
  return (
    <>
      <PageHeader title="Read Exceptions" description={`${readExceptions.length} anomalies detected in last 24 hours`} />
      <DataTable data={readExceptions} columns={cols} rowKey={(r) => r.id} searchKeys={["type", "meterId"]} />
    </>
  );
}
