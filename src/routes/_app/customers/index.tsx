import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Upload, UserCircle2, Eye } from "lucide-react";
import { customers, townships, Customer, formatCurrency, customerAvatar, customerInitials } from "@/mocks/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/customers/")({ component: CustomersList });

function CustomersList() {
  const nav = useNavigate();
  const townshipMap = Object.fromEntries(townships.map((t) => [t.id, t.name]));

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Consumer",
      accessor: (r) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={customerAvatar(r.id)} alt={r.name} />
            <AvatarFallback className="text-[10px]">{customerInitials(r.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{r.name}</p>
            <p className="truncate text-xs text-muted-foreground">{r.id} · {r.email}</p>
          </div>
        </div>
      ),
      sortValue: (r) => r.name,
    },
    { key: "township", header: "Township", accessor: (r) => <span className="text-xs">{townshipMap[r.townshipId]}</span>, sortValue: (r) => townshipMap[r.townshipId] },
    { key: "flat", header: "Flat", accessor: (r) => r.flat, sortValue: (r) => r.flat },
    { key: "tariff", header: "Tariff", accessor: (r) => <span className="inline-flex items-center rounded-md bg-info-soft px-2 py-0.5 text-xs font-medium text-info ring-1 ring-inset ring-info/20">{r.tariff}</span>, sortValue: (r) => r.tariff },
    { key: "outstanding", header: "Outstanding", accessor: (r) => (
      <span className={r.outstanding > 0 ? "font-semibold text-critical tabular-nums" : "tabular-nums text-muted-foreground"}>{formatCurrency(r.outstanding)}</span>
    ), sortValue: (r) => r.outstanding },
    { key: "meterStatus", header: "Meter", accessor: (r) => <StatusBadge status={r.meterStatus} dot />, sortValue: (r) => r.meterStatus },
    { key: "connectionStatus", header: "Status", accessor: (r) => <StatusBadge status={r.connectionStatus} />, sortValue: (r) => r.connectionStatus },
    {
      key: "actions",
      header: "Actions",
      accessor: (r) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button asChild size="sm" variant="ghost" className="h-7 px-2">
            <Link to="/customers/$id" params={{ id: r.id }} title="View">
              <Eye className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="h-7 gap-1 px-2 text-xs">
            <Link to="/consumer-view/$id" params={{ id: r.id }} title="View Consumer Portal">
              <UserCircle2 className="h-3.5 w-3.5" /> Consumer Portal
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Consumers"
        description={`${customers.length.toLocaleString("en-IN")} active customers across ${townships.length} townships`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Bulk upload template downloaded")}><Upload className="mr-1.5 h-4 w-4" /> Bulk upload</Button>
            <Button size="sm" asChild><Link to="/customers/new"><Plus className="mr-1.5 h-4 w-4" /> Add customer</Link></Button>
          </>
        }
      />
      <DataTable
        data={customers}
        columns={columns}
        searchKeys={["name", "id", "email", "flat", "mobile"]}
        searchPlaceholder="Search by name, ID, email, flat..."
        rowKey={(r) => r.id}
        onRowClick={(r) => nav({ to: "/customers/$id", params: { id: r.id } })}
        pageSize={12}
      />
    </>
  );
}
