import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { tenants, townships, formatNumber } from "@/mocks/data";
import { FormDialog } from "@/components/ui/form-dialog";

export const Route = createFileRoute("/_app/customers/utility-owners")({ component: Page });

type Owner = { id: string; name: string; tenant: string; townships: number; flats: number; contact: string; status: string };

function Page() {
  const data: Owner[] = tenants.map((t, i) => {
    const tw = townships.filter((x) => x.tenantId === t.id);
    return {
      id: `UO-${1000 + i}`,
      name: t.name,
      tenant: t.id,
      townships: tw.length,
      flats: tw.reduce((s, x) => s + x.flats, 0),
      contact: `ops@${t.name.toLowerCase().replace(/\s+/g, "")}.in`,
      status: "Active",
    };
  });

  const cols: Column<Owner>[] = [
    { key: "id", header: "Owner ID", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "name", header: "Organisation", accessor: (r) => <span className="font-medium text-foreground">{r.name}</span>, sortValue: (r) => r.name },
    { key: "townships", header: "Townships", accessor: (r) => r.townships, sortValue: (r) => r.townships },
    { key: "flats", header: "Total Flats", accessor: (r) => <span className="tabular-nums">{formatNumber(r.flats)}</span>, sortValue: (r) => r.flats },
    { key: "contact", header: "Primary Contact", accessor: (r) => <span className="text-muted-foreground">{r.contact}</span> },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
  ];

  return (
    <>
      <PageHeader title="Utility Owners" description="Top-level operators managing one or more townships" actions={
        <Button size="sm" onClick={() => toast.success("Owner onboarding flow opened")}><Plus className="mr-1.5 h-4 w-4" /> Onboard owner</Button>
      } />
      <DataTable data={data} columns={cols} rowKey={(r) => r.id} searchKeys={["name", "id"]} searchPlaceholder="Search owners..." />
    </>
  );
}
