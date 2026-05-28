import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/customers/requests")({ component: Page });

type Req = { id: string; type: string; consumer: string; township: string; raisedAt: string; status: string };

const types = ["New Connection", "Disconnection", "Tariff Change", "Meter Replacement", "Name Transfer", "Billing Dispute"];
const data: Req[] = Array.from({ length: 22 }, (_, i) => ({
  id: `REQ-${String(30000 + i).padStart(6, "0")}`,
  type: types[i % types.length],
  consumer: ["Rajesh Sharma", "Priya Patel", "Amit Reddy", "Sneha Iyer", "Vikram Nair"][i % 5],
  township: ["Prestige Lakeside", "Sobha Dream Acres", "DLF Phase 5"][i % 3],
  raisedAt: `${(i % 12) + 1}d ago`,
  status: ["Pending", "In Progress", "Approved", "Rejected", "Pending"][i % 5],
}));

function Page() {
  const cols: Column<Req>[] = [
    { key: "id", header: "Ticket", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "type", header: "Type", accessor: (r) => <span className="font-medium">{r.type}</span>, sortValue: (r) => r.type },
    { key: "consumer", header: "Consumer", accessor: (r) => r.consumer },
    { key: "township", header: "Township", accessor: (r) => <span className="text-xs text-muted-foreground">{r.township}</span> },
    { key: "raisedAt", header: "Raised", accessor: (r) => r.raisedAt },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
    { key: "actions", header: "", accessor: (r) => r.status === "Pending" ? (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" className="h-7 px-2 text-success" onClick={(e) => { e.stopPropagation(); toast.success(`Approved ${r.id}`); }}><Check className="h-3.5 w-3.5" /></Button>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-critical" onClick={(e) => { e.stopPropagation(); toast.error(`Rejected ${r.id}`); }}><X className="h-3.5 w-3.5" /></Button>
      </div>
    ) : null },
  ];
  return (
    <>
      <PageHeader title="Service Requests" description="Consumer-raised tickets awaiting action" />
      <DataTable data={data} columns={cols} rowKey={(r) => r.id} searchKeys={["consumer", "type"]} />
    </>
  );
}
