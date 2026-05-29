import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { Download, Printer, Mail, Send, FileText, QrCode, Barcode } from "lucide-react";
import { toast } from "sonner";
import { Bill, formatCurrency } from "@/mocks/data";

export function BillDetailDialog({ trigger, bill }: { trigger: ReactNode; bill: Bill }) {
  const [open, setOpen] = useState(false);
  const consumption = bill.consumption;
  const energy = Math.round(consumption * 65);
  const fixed = 150;
  const meterRent = 40;
  const service = 50;
  const subtotal = energy + fixed + meterRent + service;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Bill {bill.id}</span>
            <StatusBadge status={bill.status} dot />
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          <Tabs defaultValue="invoice">
            <TabsList>
              <TabsTrigger value="invoice">Invoice Preview</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="meter">Meter & Consumption</TabsTrigger>
            </TabsList>

            <TabsContent value="invoice" className="pt-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between border-b pb-4">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">AQ</div>
                    <p className="mt-2 text-lg font-bold">AquaUtility Pvt Ltd</p>
                    <p className="text-xs text-muted-foreground">Bengaluru, KA · GSTIN 29ABCDE1234F1Z5</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase text-muted-foreground">Tax Invoice</p>
                    <p className="font-mono text-sm font-semibold">{bill.id}</p>
                    <p className="text-xs text-muted-foreground">Date {bill.generatedAt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 text-sm">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">Billed To</p>
                    <p className="font-medium">{bill.customerName}</p>
                    <p className="text-xs text-muted-foreground">{bill.customerId}</p>
                    <p className="text-xs text-muted-foreground">{bill.township}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase text-muted-foreground">Billing Period</p>
                    <p className="font-medium">{bill.period}</p>
                    <p className="mt-2 text-xs uppercase text-muted-foreground">Due Date</p>
                    <p className="font-medium">{bill.dueDate}</p>
                  </div>
                </div>

                <table className="w-full text-sm">
                  <thead className="border-y bg-muted/40 text-xs uppercase text-muted-foreground">
                    <tr><th className="p-2 text-left">Description</th><th className="p-2 text-right">Qty</th><th className="p-2 text-right">Amount</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr><td className="p-2">Water Consumption</td><td className="p-2 text-right tabular-nums">{consumption} KL</td><td className="p-2 text-right tabular-nums">{formatCurrency(energy)}</td></tr>
                    <tr><td className="p-2">Fixed Charges</td><td className="p-2 text-right">—</td><td className="p-2 text-right tabular-nums">{formatCurrency(fixed)}</td></tr>
                    <tr><td className="p-2">Meter Rent</td><td className="p-2 text-right">—</td><td className="p-2 text-right tabular-nums">{formatCurrency(meterRent)}</td></tr>
                    <tr><td className="p-2">Service Charges</td><td className="p-2 text-right">—</td><td className="p-2 text-right tabular-nums">{formatCurrency(service)}</td></tr>
                    <tr><td className="p-2">GST (18%)</td><td className="p-2 text-right">—</td><td className="p-2 text-right tabular-nums">{formatCurrency(tax)}</td></tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t bg-muted/30 font-semibold"><td className="p-2" colSpan={2}>Total Amount Payable</td><td className="p-2 text-right tabular-nums text-lg">{formatCurrency(total)}</td></tr>
                  </tfoot>
                </table>

                <div className="mt-4 flex items-end justify-between border-t pt-4">
                  <div className="flex gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded border border-dashed text-muted-foreground"><QrCode className="h-8 w-8" /></div>
                    <div className="flex h-16 w-24 items-center justify-center rounded border border-dashed text-muted-foreground"><Barcode className="h-8 w-8" /></div>
                  </div>
                  <p className="max-w-xs text-right text-[11px] text-muted-foreground">Pay before due date to avoid 1.5% monthly surcharge. Subject to Bengaluru jurisdiction.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-3 pt-4 text-sm">
              {[
                ["Consumption Charges", energy],
                ["Fixed Charges", fixed],
                ["Meter Rent", meterRent],
                ["Service Charges", service],
                ["Subtotal", subtotal],
                ["Tax (GST 18%)", tax],
                ["Outstanding (previous)", 0],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium tabular-nums">{formatCurrency(v as number)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 text-base font-semibold">
                <span>Final Bill Amount</span><span className="tabular-nums">{formatCurrency(total)}</span>
              </div>
            </TabsContent>

            <TabsContent value="meter" className="space-y-3 pt-4 text-sm">
              <Row k="Meter Number" v={`MTR-${bill.customerId.slice(-5).toUpperCase()}`} />
              <Row k="Meter Category" v="Flat Meter" />
              <Row k="Reading Unit" v="KL (Kiloliter)" />
              <Separator />
              <Row k="Previous Reading" v={`${1240}.00`} />
              <Row k="Current Reading" v={`${1240 + consumption}.00`} />
              <Row k="Consumption" v={`${consumption} KL`} />
              <Row k="Read Dates" v={`01 ${bill.period} → 30 ${bill.period}`} />
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex-wrap gap-2 border-t bg-muted/30 px-6 py-3 sm:justify-between">
          <div className="text-xs text-muted-foreground">Bill stored permanently · Audit retained</div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Bill PDF downloaded")}><Download className="mr-1.5 h-4 w-4" /> PDF</Button>
            <Button variant="outline" size="sm" onClick={() => { window.print(); }}><Printer className="mr-1.5 h-4 w-4" /> Print</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success(`Bill emailed to ${bill.customerName}`)}><Mail className="mr-1.5 h-4 w-4" /> Email</Button>
            <Button size="sm" onClick={() => toast.success("Bill sent to customer")}><Send className="mr-1.5 h-4 w-4" /> Send Bill</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
