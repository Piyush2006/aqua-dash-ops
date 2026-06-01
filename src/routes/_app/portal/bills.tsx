import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Download, Eye, IndianRupee } from "lucide-react";
import { portalBills, consumer, formatCurrency } from "@/mocks/portal";
import { downloadPdfReport } from "@/lib/pdf-report";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/portal/bills")({ component: BillsPage });

type Bill = (typeof portalBills)[number];

function BillsPage() {
  const [open, setOpen] = useState<Bill | null>(null);

  const handleDownload = (b: Bill) => {
    downloadPdfReport({
      title: `Water Bill — ${b.period}`,
      subtitle: `${consumer.name} · ${consumer.connectionNo}`,
      meta: {
        "Bill No.": b.id,
        "Bill Date": b.billDate,
        "Due Date": b.dueDate,
        "Service Address": consumer.address,
        "Meter ID": consumer.meterId,
        "Tariff": b.tariff,
      },
      sections: [
        { heading: "Consumption details", paragraph: `Total consumption: ${b.consumption} KL for the period ${b.period}.` },
        {
          heading: "Charges breakdown",
          table: {
            head: ["Description", "Amount (₹)"],
            body: b.breakdown.map((c) => [c.label, c.value.toLocaleString("en-IN")]),
          },
        },
        { heading: "Total payable", paragraph: `${formatCurrency(b.amount)} — Status: ${b.status}` },
      ],
      filename: `${b.id}.pdf`,
    });
    toast.success(`Bill ${b.id} downloaded`);
  };

  const cols: Column<Bill>[] = [
    { key: "id", header: "Bill No.", accessor: (b) => <span className="font-mono text-xs">{b.id}</span> },
    { key: "period", header: "Period", accessor: (b) => <span className="font-medium">{b.period}</span> },
    { key: "billDate", header: "Bill Date", accessor: (b) => b.billDate },
    { key: "dueDate", header: "Due Date", accessor: (b) => b.dueDate },
    { key: "consumption", header: "KL", accessor: (b) => <span className="tabular-nums">{b.consumption}</span>, sortValue: (b) => b.consumption },
    { key: "amount", header: "Amount", accessor: (b) => <span className="tabular-nums font-medium">{formatCurrency(b.amount)}</span>, sortValue: (b) => b.amount },
    { key: "status", header: "Status", accessor: (b) => <StatusBadge status={b.status} dot /> },
    {
      key: "actions", header: "", accessor: (b) => (
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); setOpen(b); }}>
            <Eye className="mr-1 h-3.5 w-3.5" /> View
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); handleDownload(b); }}>
            <Download className="mr-1 h-3.5 w-3.5" /> PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="My Bills"
        description="View, download and track your billing history"
        actions={
          <Button size="sm" onClick={() => toast.success("Redirecting to payment gateway...")}>
            <IndianRupee className="mr-1.5 h-4 w-4" /> Pay current bill
          </Button>
        }
      />

      <DataTable data={portalBills} columns={cols} rowKey={(b) => b.id} searchKeys={["id", "period", "status"]} onRowClick={(b) => setOpen(b)} />

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>Bill {open.id}</DialogTitle>
                <DialogDescription>{consumer.name} · {open.period}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3 text-xs">
                <Info label="Bill Date" value={open.billDate} />
                <Info label="Due Date" value={open.dueDate} />
                <Info label="Meter" value={consumer.meterId} />
                <Info label="Tariff" value={open.tariff} />
                <Info label="Consumption" value={`${open.consumption} KL`} />
                <Info label="Status" value={<StatusBadge status={open.status} dot />} />
              </div>

              <div className="rounded-lg border">
                <div className="border-b bg-muted/30 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Charges breakdown</div>
                <div className="divide-y text-sm">
                  {open.breakdown.map((c) => (
                    <div key={c.label} className="flex items-center justify-between px-3 py-2">
                      <span className="text-muted-foreground">{c.label}</span>
                      <span className="tabular-nums font-medium">{formatCurrency(c.value)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between bg-primary/5 px-3 py-2.5">
                    <span className="font-semibold">Total payable</span>
                    <span className="tabular-nums text-base font-bold">{formatCurrency(open.amount)}</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => handleDownload(open)}>
                  <Download className="mr-1.5 h-4 w-4" /> Download PDF
                </Button>
                {open.status !== "Paid" && (
                  <Button onClick={() => { toast.success("Payment initiated"); setOpen(null); }}>
                    <IndianRupee className="mr-1.5 h-4 w-4" /> Pay {formatCurrency(open.amount)}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-0.5 font-medium text-foreground">{value}</div>
    </div>
  );
}
