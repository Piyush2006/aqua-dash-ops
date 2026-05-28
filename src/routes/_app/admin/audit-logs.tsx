import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { auditLog, AuditEntry } from "@/mocks/data";

export const Route = createFileRoute("/_app/admin/audit-logs")({ component: Page });

function Page() {
  const cols: Column<AuditEntry>[] = [
    { key: "id", header: "Log ID", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "timestamp", header: "Timestamp", accessor: (r) => <span className="font-mono text-xs">{r.timestamp}</span>, sortValue: (r) => r.timestamp },
    { key: "actor", header: "Actor", accessor: (r) => <span className="font-medium">{r.actor}</span> },
    { key: "action", header: "Action", accessor: (r) => <span className="rounded-md bg-info-soft px-2 py-0.5 text-xs font-medium text-info capitalize">{r.action}</span> },
    { key: "entity", header: "Entity", accessor: (r) => r.entity },
    { key: "entityId", header: "Entity ID", accessor: (r) => <span className="font-mono text-xs">{r.entityId}</span> },
    { key: "category", header: "Category", accessor: (r) => <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{r.category}</span> },
  ];
  return (
    <>
      <PageHeader title="Audit Logs" description="Complete immutable activity trail" />
      <DataTable data={auditLog} columns={cols} rowKey={(r) => r.id} searchKeys={["actor", "entity", "entityId"]} pageSize={15} />
    </>
  );
}
