import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";
import { toast } from "sonner";
import { BillingScheduleBuilderDialog } from "@/components/billing/BillingScheduleBuilderDialog";

export const Route = createFileRoute("/_app/billing/schedules")({ component: Page });

type Sched = { id: string; name: string; cycle: string; scope: string; period: string; genDate: string; status: string };
const data: Sched[] = [
  { id: "BS-001", name: "January Residential", cycle: "Monthly", scope: "All residential", period: "01 Jan – 31 Jan 2026", genDate: "05 Feb 2026", status: "Active" },
  { id: "BS-002", name: "Weekly Commercial", cycle: "Weekly", scope: "Commercial", period: "20 – 26 Nov 2025", genDate: "27 Nov 2025", status: "Active" },
  { id: "BS-003", name: "Industrial Daily", cycle: "Daily", scope: "Industrial bulk", period: "Rolling 24h", genDate: "Daily 23:00", status: "Active" },
  { id: "BS-004", name: "Penalty Recompute", cycle: "Monthly", scope: "Overdue invoices", period: "Nov 2025", genDate: "16 Dec 2025", status: "Active" },
  { id: "BS-005", name: "Annual Tariff Revision", cycle: "Yearly", scope: "All consumers", period: "Apr 2025 – Mar 2026", genDate: "01 Apr 2026", status: "Draft" },
];

function Page() {
  const cols: Column<Sched>[] = [
    { key: "id", header: "Schedule", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "name", header: "Name", accessor: (r) => <span className="font-medium">{r.name}</span>, sortValue: (r) => r.name },
    { key: "cycle", header: "Cycle", accessor: (r) => <span className="rounded-md bg-info-soft px-2 py-0.5 text-xs font-medium text-info">{r.cycle}</span> },
    { key: "scope", header: "Scope", accessor: (r) => <span className="text-muted-foreground">{r.scope}</span> },
    { key: "period", header: "Billing Period", accessor: (r) => r.period },
    { key: "genDate", header: "Generate On", accessor: (r) => <span className="font-medium">{r.genDate}</span> },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
    { key: "actions", header: "", accessor: (r) => (
      <Button size="sm" variant="outline" className="h-7" onClick={(e) => { e.stopPropagation(); toast.success(`${r.name} triggered`); }}><Play className="mr-1 h-3 w-3" /> Run</Button>
    ) },
  ];
  return (
    <>
      <PageHeader title="Billing Schedules" description="Generate bills using consumption from a billing period" actions={
        <BillingScheduleBuilderDialog trigger={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New schedule</Button>} />
      } />
      <DataTable data={data} columns={cols} rowKey={(r) => r.id} />
    </>
  );
}
