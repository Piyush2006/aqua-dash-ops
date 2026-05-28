import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/approvals")({ component: Page });

type Appr = { id: string; entity: string; requester: string; submittedAt: string; type: string; status: string };
const data: Appr[] = [
  { id: "APR-001", entity: "Tariff TOU-Smart v1.0", requester: "Priya Sharma", submittedAt: "2h ago", type: "Tariff", status: "Pending" },
  { id: "APR-002", entity: "Bill INV-0202418 correction", requester: "Amit Reddy", submittedAt: "5h ago", type: "Bill", status: "Pending" },
  { id: "APR-003", entity: "Bulk meter replacement (12 units)", requester: "Vikram Iyer", submittedAt: "1d ago", type: "Meter", status: "Pending" },
  { id: "APR-004", entity: "Refund to CUS-010042", requester: "Sneha Patel", submittedAt: "1d ago", type: "Refund", status: "Pending" },
  { id: "APR-005", entity: "User role: Billing Operator → Admin", requester: "Rajesh Kumar", submittedAt: "2d ago", type: "User", status: "Pending" },
  { id: "APR-006", entity: "Tariff Residential-A v3.2", requester: "Priya Sharma", submittedAt: "5d ago", type: "Tariff", status: "Approved" },
];

function Page() {
  const cols: Column<Appr>[] = [
    { key: "id", header: "ID", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "entity", header: "Entity", accessor: (r) => <span className="font-medium">{r.entity}</span>, sortValue: (r) => r.entity },
    { key: "type", header: "Type", accessor: (r) => <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{r.type}</span> },
    { key: "requester", header: "Requester", accessor: (r) => r.requester },
    { key: "submittedAt", header: "Submitted", accessor: (r) => <span className="text-muted-foreground">{r.submittedAt}</span> },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
    { key: "actions", header: "", accessor: (r) => r.status === "Pending" ? (
      <div className="flex gap-1">
        <Button size="sm" variant="ghost" className="h-7 px-2 text-success" onClick={() => toast.success(`${r.id} approved`)}><Check className="h-3.5 w-3.5" /></Button>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-critical" onClick={() => toast.error(`${r.id} rejected`)}><X className="h-3.5 w-3.5" /></Button>
      </div>
    ) : null },
  ];
  return (
    <>
      <PageHeader title="Approvals Queue" description="Items awaiting your sign-off" />
      <DataTable data={data} columns={cols} rowKey={(r) => r.id} searchKeys={["entity", "requester"]} />
    </>
  );
}
