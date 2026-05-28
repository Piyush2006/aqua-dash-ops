import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { tariffsList, Tariff, formatNumber } from "@/mocks/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/billing/tariffs")({ component: Page });

function Page() {
  const cols: Column<Tariff>[] = [
    { key: "id", header: "ID", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "name", header: "Name", accessor: (r) => <div><p className="font-medium text-foreground">{r.name}</p><p className="text-xs text-muted-foreground">Version {r.version}</p></div>, sortValue: (r) => r.name },
    { key: "type", header: "Type", accessor: (r) => <span className="rounded-md bg-info-soft px-2 py-0.5 text-xs font-medium text-info">{r.type}</span> },
    { key: "slabs", header: "Slabs", accessor: (r) => <span className="font-mono text-xs">{r.slabs.length} tier{r.slabs.length > 1 ? "s" : ""}</span> },
    { key: "applied", header: "Applied to", accessor: (r) => <span className="tabular-nums">{formatNumber(r.appliedTo)}</span>, sortValue: (r) => r.appliedTo },
    { key: "effective", header: "Effective", accessor: (r) => r.effectiveFrom },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
  ];
  return (
    <>
      <PageHeader title="Tariffs" description="Pricing plans and approval lifecycle" actions={
        <Button size="sm" onClick={() => toast.success("New tariff draft created")}><Plus className="mr-1.5 h-4 w-4" /> New tariff</Button>
      } />
      <DataTable data={tariffsList} columns={cols} rowKey={(r) => r.id} searchKeys={["name", "type"]} />
    </>
  );
}
