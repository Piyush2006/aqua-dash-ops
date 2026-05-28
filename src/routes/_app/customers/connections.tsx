import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { customers, townships } from "@/mocks/data";

export const Route = createFileRoute("/_app/customers/connections")({ component: Page });

function Page() {
  const twMap = Object.fromEntries(townships.map((t) => [t.id, t.name]));
  const cols: Column<typeof customers[number]>[] = [
    { key: "id", header: "Connection ID", accessor: (r) => <span className="font-mono text-xs">CON-{r.id.slice(-6)}</span> },
    { key: "customer", header: "Consumer", accessor: (r) => <span className="font-medium">{r.name}</span>, sortValue: (r) => r.name },
    { key: "flat", header: "Flat", accessor: (r) => r.flat },
    { key: "township", header: "Township", accessor: (r) => <span className="text-xs text-muted-foreground">{twMap[r.townshipId]}</span> },
    { key: "tariff", header: "Tariff", accessor: (r) => r.tariff },
    { key: "occupancy", header: "Occupancy", accessor: (r) => <StatusBadge status={r.occupancy} /> },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.connectionStatus} dot /> },
  ];
  return (
    <>
      <PageHeader title="Connections" description={`${customers.length} active utility connections`} />
      <DataTable data={customers} columns={cols} rowKey={(r) => r.id} searchKeys={["name", "flat"]} pageSize={15} />
    </>
  );
}
