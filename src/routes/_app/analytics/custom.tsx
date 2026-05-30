import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { FormDialog } from "@/components/ui/form-dialog";
import { downloadPdfReport } from "@/lib/pdf-report";
import { revenueTrend, townshipComparison, outstandingAging, formatCurrency } from "@/mocks/data";

function buildReportPayload(name: string, id: string, schedule: string) {
  return {
    title: name,
    subtitle: "AquaOps Smart Utility Platform",
    meta: { "Report ID": id, "Schedule": schedule, "Generated": new Date().toLocaleString("en-IN") },
    sections: [
      { heading: "Executive Summary", paragraph: `${name} consolidates the latest operational and financial signals across all townships in scope. Key trends, outliers and recommended actions are summarised below.` },
      { heading: "Revenue Snapshot", table: {
        head: ["Month", "Billed (₹ Cr)", "Collected (₹ Cr)", "Outstanding (₹ Cr)"],
        body: revenueTrend.slice(-6).map((r) => [r.month, r.revenue.toFixed(2), r.collected.toFixed(2), r.outstanding.toFixed(2)]),
      } },
      { heading: "Township Comparison", table: {
        head: ["Township", "Revenue (₹ L)", "Consumption (KL)"],
        body: townshipComparison.map((t) => [t.name, t.revenue, t.consumption]),
      } },
      { heading: "Outstanding Aging", table: {
        head: ["Bucket", "Amount (₹ L)"],
        body: outstandingAging.map((a) => [a.bucket, a.amount]),
      } },
      { heading: "Notes", paragraph: `Total outstanding currently stands at ${formatCurrency(3_84_12_500)} with a 5.6% reduction MoM. Collection efficiency continues to trend above the 90% target.` },
    ],
    filename: `${id}_${name}`,
  };
}


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
        <FormDialog
          trigger={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New report</Button>}
          title="Build a new report"
          successMessage="Report created"
          fields={[
            { name: "name", label: "Report name", required: true, placeholder: "e.g. Township Scorecard" },
            { name: "schedule", label: "Schedule", type: "select", required: true, options: ["One-off", "Daily", "Weekly", "Monthly", "Quarterly"] },
            { name: "format", label: "Format", type: "select", required: true, options: ["PDF", "XLSX", "CSV"] },
            { name: "recipients", label: "Recipients (comma separated)", placeholder: "ops@…, ceo@…" },
          ]}
        />
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
