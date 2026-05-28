import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { FormDialog } from "@/components/ui/form-dialog";

export const Route = createFileRoute("/_app/analytics/custom")({ component: Page });

const reports = [
  { id: "RPT-001", name: "Monthly Revenue Brief", schedule: "Monthly · 2nd", recipients: 4, format: "PDF" },
  { id: "RPT-002", name: "NRW Deep Dive", schedule: "Quarterly", recipients: 2, format: "XLSX" },
  { id: "RPT-003", name: "Township Scorecard", schedule: "Weekly · Mon", recipients: 8, format: "PDF" },
  { id: "RPT-004", name: "Defaulter Watchlist", schedule: "Weekly · Fri", recipients: 3, format: "XLSX" },
  { id: "RPT-005", name: "Meter Exception Digest", schedule: "Daily", recipients: 6, format: "PDF" },
  { id: "RPT-006", name: "Board Pack (Exec Summary)", schedule: "Monthly", recipients: 12, format: "PDF" },
];

function Page() {
  return (
    <>
      <PageHeader title="Custom Reports" description="Build, schedule and distribute reports" actions={
        <Button size="sm" onClick={() => toast.success("New report builder opened")}><Plus className="mr-1.5 h-4 w-4" /> New report</Button>
      } />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <div key={r.id} className="group rounded-xl border bg-card p-5 shadow-card transition hover:shadow-card-hover">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
              <span className="ml-auto rounded-md bg-muted px-2 py-0.5 font-mono text-xs">{r.format}</span>
            </div>
            <h3 className="font-semibold text-foreground">{r.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{r.schedule} · {r.recipients} recipients</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success(`${r.name} downloaded`)}><Download className="mr-1 h-3.5 w-3.5" /> Download</Button>
              <Button size="sm" variant="ghost" onClick={() => toast.success(`${r.name} sent`)}>Send now</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
