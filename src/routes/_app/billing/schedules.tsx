import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";
import { toast } from "sonner";
import { FormDialog } from "@/components/ui/form-dialog";

export const Route = createFileRoute("/_app/billing/schedules")({ component: Page });

type Sched = { id: string; name: string; cycle: string; scope: string; nextRun: string; lastRun: string; status: string };
const data: Sched[] = [
  { id: "BS-001", name: "Monthly Residential Billing", cycle: "Monthly · 1st", scope: "All residential", nextRun: "01 Dec 2025, 02:00", lastRun: "01 Nov 2025", status: "Active" },
  { id: "BS-002", name: "Weekly Commercial Billing", cycle: "Weekly · Mon", scope: "Commercial tier", nextRun: "02 Dec 2025, 06:00", lastRun: "25 Nov 2025", status: "Active" },
  { id: "BS-003", name: "Industrial Daily", cycle: "Daily · 23:00", scope: "Industrial bulk", nextRun: "Tonight 23:00", lastRun: "Yesterday", status: "Active" },
  { id: "BS-004", name: "Penalty Recompute", cycle: "Monthly · 16th", scope: "Overdue invoices", nextRun: "16 Dec 2025", lastRun: "16 Nov 2025", status: "Active" },
  { id: "BS-005", name: "Annual Tariff Revision", cycle: "Yearly · Apr 1", scope: "All consumers", nextRun: "01 Apr 2026", lastRun: "01 Apr 2025", status: "Draft" },
];

function Page() {
  const cols: Column<Sched>[] = [
    { key: "id", header: "Schedule", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "name", header: "Name", accessor: (r) => <span className="font-medium">{r.name}</span>, sortValue: (r) => r.name },
    { key: "cycle", header: "Cycle", accessor: (r) => <span className="rounded-md bg-info-soft px-2 py-0.5 text-xs font-medium text-info">{r.cycle}</span> },
    { key: "scope", header: "Scope", accessor: (r) => <span className="text-muted-foreground">{r.scope}</span> },
    { key: "lastRun", header: "Last Run", accessor: (r) => r.lastRun },
    { key: "nextRun", header: "Next Run", accessor: (r) => <span className="font-medium">{r.nextRun}</span> },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
    { key: "actions", header: "", accessor: (r) => (
      <Button size="sm" variant="outline" className="h-7" onClick={(e) => { e.stopPropagation(); toast.success(`${r.name} triggered`); }}><Play className="mr-1 h-3 w-3" /> Run</Button>
    ) },
  ];
  return (
    <>
      <PageHeader title="Billing Schedules" description="Automated invoice generation jobs" actions={
        <FormDialog
          trigger={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New schedule</Button>}
          title="New billing schedule"
          successMessage="Schedule created"
          fields={[
            { name: "name", label: "Schedule name", required: true, placeholder: "e.g. Monthly Residential" },
            { name: "cycle", label: "Cycle", type: "select", required: true, options: ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"] },
            { name: "scope", label: "Scope", type: "select", required: true, options: ["All residential", "All commercial", "Industrial bulk", "All consumers"] },
            { name: "startDate", label: "First run", type: "date", required: true },
          ]}
        />
      } />
      <DataTable data={data} columns={cols} rowKey={(r) => r.id} />
    </>
  );
}
