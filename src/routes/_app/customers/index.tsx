import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { customers, townships, Customer, formatCurrency } from "@/mocks/data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/customers/")({ component: CustomersList });

function CustomersList() {
  const nav = useNavigate();
  const townshipMap = Object.fromEntries(townships.map((t) => [t.id, t.name]));

  const columns: Column<Customer>[] = [
    { key: "id", header: "Customer ID", accessor: (r) => <span className="font-mono text-xs">{r.id}</span>, sortValue: (r) => r.id },
    { key: "name", header: "Name", accessor: (r) => (
      <div>
        <p className="font-medium text-foreground">{r.name}</p>
        <p className="text-xs text-muted-foreground">{r.email}</p>
      </div>
    ), sortValue: (r) => r.name },
    { key: "township", header: "Township", accessor: (r) => <span className="text-xs">{townshipMap[r.townshipId]}</span>, sortValue: (r) => townshipMap[r.townshipId] },
    { key: "flat", header: "Flat", accessor: (r) => r.flat, sortValue: (r) => r.flat },
    { key: "tariff", header: "Tariff", accessor: (r) => <span className="inline-flex items-center rounded-md bg-info-soft px-2 py-0.5 text-xs font-medium text-info ring-1 ring-inset ring-info/20">{r.tariff}</span>, sortValue: (r) => r.tariff },
    { key: "outstanding", header: "Outstanding", accessor: (r) => (
      <span className={r.outstanding > 0 ? "font-semibold text-critical tabular-nums" : "tabular-nums text-muted-foreground"}>{formatCurrency(r.outstanding)}</span>
    ), sortValue: (r) => r.outstanding },
    { key: "lastReading", header: "Last Reading", accessor: (r) => <span className="tabular-nums">{r.lastReading.toLocaleString("en-IN")} L</span>, sortValue: (r) => r.lastReading },
    { key: "meterStatus", header: "Meter", accessor: (r) => <StatusBadge status={r.meterStatus} dot />, sortValue: (r) => r.meterStatus },
    { key: "connectionStatus", header: "Connection", accessor: (r) => <StatusBadge status={r.connectionStatus} />, sortValue: (r) => r.connectionStatus },
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
