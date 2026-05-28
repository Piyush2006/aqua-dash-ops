import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { townships, formatNumber } from "@/mocks/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/customers/admin-owners")({ component: Page });

type Admin = { id: string; township: string; city: string; flats: number; manager: string; mobile: string; status: string };

function Page() {
  const data: Admin[] = townships.map((t, i) => ({
    id: `AO-${2000 + i}`,
    township: t.name,
    city: t.city,
    flats: t.flats,
    manager: ["Rajesh Kumar", "Priya Sharma", "Vikram Iyer", "Sneha Patel", "Arjun Nair", "Meera Reddy"][i % 6],
    mobile: `+91 98${(76543210 + i).toString().slice(0, 8)}`,
    status: "Active",
  }));

  const cols: Column<Admin>[] = [
    { key: "id", header: "Admin ID", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "township", header: "Township", accessor: (r) => <span className="font-medium text-foreground">{r.township}</span>, sortValue: (r) => r.township },
    { key: "city", header: "City", accessor: (r) => r.city },
    { key: "flats", header: "Flats", accessor: (r) => <span className="tabular-nums">{formatNumber(r.flats)}</span>, sortValue: (r) => r.flats },
    { key: "manager", header: "Site Manager", accessor: (r) => r.manager },
    { key: "mobile", header: "Contact", accessor: (r) => <span className="text-muted-foreground">{r.mobile}</span> },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
  ];

  return (
    <>
      <PageHeader title="Admin Owners" description="Township-level administrators and site managers" actions={
        <Button size="sm" onClick={() => toast.success("Admin invite sent")}><Plus className="mr-1.5 h-4 w-4" /> Invite admin</Button>
      } />
      <DataTable data={data} columns={cols} rowKey={(r) => r.id} searchKeys={["township", "manager"]} searchPlaceholder="Search admins..." />
    </>
  );
}
