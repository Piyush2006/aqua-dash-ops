import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Zap, Eye, Receipt, IndianRupee, FileWarning, CheckCircle2, AlertTriangle } from "lucide-react";
import { bills, Bill, formatCurrency, formatNumber } from "@/mocks/data";
import { FormDialog } from "@/components/ui/form-dialog";
import { KpiCard } from "@/components/ui/kpi-card";
import { BillDetailDialog } from "@/components/billing/BillDetailDialog";

export const Route = createFileRoute("/_app/billing/bills")({ component: Page });

function Page() {
  const total = bills.length;
  const paid = bills.filter((b) => b.status === "Paid").length;
  const pending = bills.filter((b) => ["Generated", "Sent", "Approved"].includes(b.status)).length;
  const overdue = bills.filter((b) => b.status === "Overdue").length;
  const revenue = bills.reduce((a, b) => a + b.amount, 0);
  const avg = Math.round(revenue / total);
  const efficiency = Math.round((paid / total) * 100);

  const cols: Column<Bill>[] = [
    { key: "id", header: "Bill #", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "customer", header: "Consumer", accessor: (r) => <div><p className="font-medium">{r.customerName}</p><p className="text-xs text-muted-foreground">{r.customerId}</p></div>, sortValue: (r) => r.customerName },
    { key: "township", header: "Township", accessor: (r) => <span className="text-muted-foreground">{r.township}</span> },
    { key: "period", header: "Period", accessor: (r) => r.period },
    { key: "cons", header: "Consumption", accessor: (r) => <span className="tabular-nums">{r.consumption} KL</span>, sortValue: (r) => r.consumption },
    { key: "amount", header: "Amount", accessor: (r) => <span className="font-semibold tabular-nums">{formatCurrency(r.amount)}</span>, sortValue: (r) => r.amount },
    { key: "due", header: "Due", accessor: (r) => r.dueDate },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
    { key: "actions", header: "", accessor: (r) => (
      <BillDetailDialog
        bill={r}
        trigger={<Button size="sm" variant="outline" className="h-7" onClick={(e) => e.stopPropagation()}><Eye className="mr-1 h-3 w-3" /> View</Button>}
      />
    ) },
  ];
  return (
    <>
      <PageHeader title="Bill Management" description={`${formatNumber(total)} bills · view, download, print and send`} actions={
        <FormDialog
          trigger={<Button size="sm"><Zap className="mr-1.5 h-4 w-4" /> Run billing</Button>}
          title="Run billing cycle"
          description="Generate invoices for the selected scope."
          submitLabel="Run now"
          successMessage="Billing run scheduled"
          fields={[
            { name: "scope", label: "Scope", type: "select", required: true, options: ["All consumers", "Residential", "Commercial", "Industrial"] },
            { name: "period", label: "Billing period", required: true, placeholder: "e.g. Jan 2026" },
            { name: "dueDate", label: "Due date", type: "date", required: true },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
        />
      } />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        <KpiCard variant="primary" label="Total Bills" value={formatNumber(total)} icon={Receipt} />
        <KpiCard label="Revenue" value={formatCurrency(revenue)} icon={IndianRupee} />
        <KpiCard variant="success" label="Paid" value={formatNumber(paid)} icon={CheckCircle2} />
        <KpiCard label="Pending" value={formatNumber(pending)} icon={FileWarning} />
        <KpiCard label="Overdue" value={formatNumber(overdue)} icon={AlertTriangle} />
        <KpiCard label="Avg Bill" value={formatCurrency(avg)} />
        <KpiCard label="Collection %" value={`${efficiency}%`} />
      </div>

      <DataTable data={bills} columns={cols} rowKey={(r) => r.id} searchKeys={["customerName", "id", "township"]} pageSize={15} />
    </>
  );
}
