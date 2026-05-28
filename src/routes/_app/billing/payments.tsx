import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { payments, Payment, formatCurrency } from "@/mocks/data";

export const Route = createFileRoute("/_app/billing/payments")({ component: Page });

function Page() {
  const cols: Column<Payment>[] = [
    { key: "id", header: "Payment", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "bill", header: "Invoice", accessor: (r) => <span className="font-mono text-xs">{r.billId}</span> },
    { key: "customer", header: "Consumer", accessor: (r) => <span className="font-medium">{r.customerName}</span>, sortValue: (r) => r.customerName },
    { key: "method", header: "Method", accessor: (r) => <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{r.method}</span> },
    { key: "amount", header: "Amount", accessor: (r) => <span className="font-semibold tabular-nums">{formatCurrency(r.amount)}</span>, sortValue: (r) => r.amount },
    { key: "date", header: "Date", accessor: (r) => r.date },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
  ];
  return (
    <>
      <PageHeader title="Payments" description={`${payments.length} payments reconciled`} />
      <DataTable data={payments} columns={cols} rowKey={(r) => r.id} searchKeys={["customerName", "id", "billId"]} pageSize={15} />
    </>
  );
}
