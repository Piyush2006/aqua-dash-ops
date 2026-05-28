import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { bills, Bill, formatCurrency } from "@/mocks/data";
import { toast } from "sonner";
import { FormDialog } from "@/components/ui/form-dialog";

export const Route = createFileRoute("/_app/billing/bills")({ component: Page });

function Page() {
  const cols: Column<Bill>[] = [
    { key: "id", header: "Invoice", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "customer", header: "Consumer", accessor: (r) => <div><p className="font-medium">{r.customerName}</p><p className="text-xs text-muted-foreground">{r.township}</p></div>, sortValue: (r) => r.customerName },
    { key: "period", header: "Period", accessor: (r) => r.period },
    { key: "cons", header: "Consumption", accessor: (r) => <span className="tabular-nums">{r.consumption} KL</span>, sortValue: (r) => r.consumption },
    { key: "amount", header: "Amount", accessor: (r) => <span className="font-semibold tabular-nums">{formatCurrency(r.amount)}</span>, sortValue: (r) => r.amount },
    { key: "due", header: "Due Date", accessor: (r) => r.dueDate },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
  ];
  return (
    <>
      <PageHeader title="Bills" description={`${bills.length} invoices in current cycle`} actions={
        <FormDialog
          trigger={<Button size="sm"><Zap className="mr-1.5 h-4 w-4" /> Run billing</Button>}
          title="Run billing cycle"
          description="Generate invoices for the selected scope."
          submitLabel="Run now"
          successMessage="Billing run scheduled"
          fields={[
            { name: "scope", label: "Scope", type: "select", required: true, options: ["All consumers", "Residential", "Commercial", "Industrial"] },
            { name: "period", label: "Billing period", required: true, placeholder: "e.g. Nov 2025" },
            { name: "dueDate", label: "Due date", type: "date", required: true },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
        />
      } />
      <DataTable data={bills} columns={cols} rowKey={(r) => r.id} searchKeys={["customerName", "id"]} pageSize={15} />
    </>
  );
}
