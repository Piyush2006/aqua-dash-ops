import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { Download, Printer, Mail, Send, FileText, Droplets } from "lucide-react";
import { toast } from "sonner";
import { Bill, formatCurrency } from "@/mocks/data";
import { BarsChart } from "@/components/charts";

// Tiered slab structure (₹ per KL)
const TIERS = [
  { name: "Tier 1", range: "0–15 KL", rate: 60 },
  { name: "Tier 2", range: "16–25 KL", rate: 80 },
  { name: "Tier 3", range: "26–80 KL", rate: 130 },
  { name: "Tier 4", range: "81+ KL", rate: 195 },
];

function computeTierBreakdown(consumption: number) {
  const limits = [15, 10, 55, Infinity];
  let remaining = consumption;
  return TIERS.map((t, i) => {
    const units = Math.max(0, Math.min(remaining, limits[i]));
    remaining -= units;
    return { ...t, units, amount: Math.round(units * t.rate) };
  });
}

export function BillDetailDialog({ trigger, bill }: { trigger: ReactNode; bill: Bill }) {
  const [open, setOpen] = useState(false);
  const consumption = bill.consumption;
  const tierRows = computeTierBreakdown(consumption);
  const tieredTotal = tierRows.reduce((a, r) => a + r.amount, 0);
  const serviceCharge = 480;
  const watershedFee = Math.round(consumption * 6);
  const capitalFee = 315;
  const previousBalance = 0;
  const paymentsReceived = 0;
  const adjustments = 0;
  const subtotal = tieredTotal + serviceCharge + watershedFee + capitalFee;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax + previousBalance - paymentsReceived + adjustments;

  const usageHistory = [
    { period: "Jun '25", you: Math.round(consumption * 0.8), avg: Math.round(consumption * 0.95) },
    { period: "Aug '25", you: Math.round(consumption * 1.1), avg: Math.round(consumption * 1.0) },
    { period: "Oct '25", you: Math.round(consumption * 1.25), avg: Math.round(consumption * 1.05) },
    { period: "Dec '25", you: Math.round(consumption * 0.95), avg: Math.round(consumption * 0.9) },
    { period: "Feb '26", you: Math.round(consumption * 1.05), avg: Math.round(consumption * 0.95) },
    { period: "Apr '26", you: Math.round(consumption * 0.9), avg: Math.round(consumption * 0.92) },
    { period: bill.period.slice(0, 6), you: consumption, avg: Math.round(consumption * 0.96) },
  ];

  const meterNo = `MTR-${bill.customerId.slice(-5).toUpperCase()}`;
  const priorReading = 4200;
  const currentReading = priorReading + consumption;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-5xl p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Bill {bill.id}</span>
            <StatusBadge status={bill.status} dot />
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto px-6 py-4">
          <Tabs defaultValue="invoice">
            <TabsList>
              <TabsTrigger value="invoice">Invoice Preview</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="meter">Meter & Consumption</TabsTrigger>
            </TabsList>

            <TabsContent value="invoice" className="pt-4">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                {/* Header */}
                <div className="grid grid-cols-2 gap-6 border-b pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Droplets className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-primary">AQUA UTILITY</p>
                        <p className="text-[11px] text-muted-foreground">No. 14, Outer Ring Road<br />Bengaluru, KA 560103</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs">
                      <p className="font-semibold uppercase">{bill.customerName}</p>
                      <p className="text-muted-foreground">{bill.township}</p>
                      <p className="text-muted-foreground">Bengaluru, KA</p>
                    </div>
                    <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
                      <span className="font-medium">Billing Inquiries:</span><span>1800.123.4567</span>
                      <span className="font-medium">Emergency:</span><span>1800.123.4500</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-primary">ACCOUNT INFORMATION</p>
                    <div className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
                      <span>Customer Number:</span><span className="font-mono">{bill.customerId}</span>
                      <span>Service Number:</span><span className="font-mono">{bill.id}</span>
                      <span>Billing Date:</span><span>{bill.generatedAt}</span>
                      <span>Service Address:</span><span>{bill.township}</span>
                    </div>
                    <p className="mt-4 text-sm font-bold text-primary">IMPORTANT INFORMATION</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Aqua Utility uses this section to share important updates with consumers. Pay before due date to avoid 1.5% monthly surcharge.</p>
                  </div>
                </div>

                {/* Body grid */}
                <div className="grid grid-cols-2 gap-6 pt-4">
                  {/* Left: Account details */}
                  <div>
                    <p className="text-sm font-bold text-primary">ACCOUNT DETAILS</p>
                    <div className="mt-2 space-y-1 text-xs">
                      <Line k="Previous Balance:" v={formatCurrency(previousBalance)} />
                      <Line k={`Payments – Thank You (${bill.generatedAt}):`} v={`-${formatCurrency(paymentsReceived)}`} />
                      <Line k="Adjustments:" v={formatCurrency(adjustments)} />
                    </div>

                    <p className="mt-3 text-sm font-bold text-primary">WATER SERVICE</p>
                    <div className="mt-1 bg-muted/40 px-2 py-1">
                      <Line k="Service Charge:" v={formatCurrency(serviceCharge)} />
                    </div>
                    <p className="mt-3 text-xs font-semibold">Watershed Management Fee:</p>
                    <div className="pl-3"><Line k={`${consumption} units @ ₹6.00`} v={formatCurrency(watershedFee)} /></div>

                    <div className="mt-1 bg-muted/40 px-2 py-1">
                      <Line k="Capital Maintenance Fee:" v={formatCurrency(capitalFee)} />
                    </div>

                    <p className="mt-3 text-xs font-semibold">Tiered Rates & Allotments:</p>
                    <div className="space-y-0.5 pl-3 text-xs">
                      {tierRows.map((t) => (
                        <Line key={t.name} k={`${t.name}: ${t.units} units @ ₹${t.rate.toFixed(2)}`} v={formatCurrency(t.amount)} />
                      ))}
                    </div>

                    <div className="mt-3 border-t-2 border-primary pt-2 text-sm font-bold text-primary">
                      <Line k={`TOTAL AMOUNT DUE BY ${bill.dueDate}`} v={formatCurrency(total)} bold />
                    </div>
                  </div>

                  {/* Right: Water usage */}
                  <div>
                    <p className="text-sm font-bold text-primary">WATER USAGE</p>
                    <p className="text-[11px] text-muted-foreground">Meter Read Date: 01 {bill.period} – 30 {bill.period}</p>

                    <table className="mt-2 w-full text-[11px]">
                      <thead className="border-y bg-muted/40">
                        <tr className="text-left">
                          <th className="p-1 font-semibold">Service No.</th>
                          <th className="p-1 font-semibold">Meter Size</th>
                          <th className="p-1 text-right font-semibold">Prior</th>
                          <th className="p-1 text-right font-semibold">Current</th>
                          <th className="p-1 text-right font-semibold">Units*</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-1 font-mono">{meterNo}</td>
                          <td className="p-1">15mm</td>
                          <td className="p-1 text-right tabular-nums">{priorReading}</td>
                          <td className="p-1 text-right tabular-nums">{currentReading}</td>
                          <td className="p-1 text-right tabular-nums font-semibold">{consumption}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="mt-1 text-[10px] text-muted-foreground">*1 unit = 1 KL (Kiloliter) = 1,000 litres</p>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] font-bold text-primary">YOUR WATER USE</p>
                        <table className="mt-1 w-full text-[11px]">
                          <thead><tr className="text-muted-foreground"><th></th><th className="text-right">This Yr</th><th className="text-right">Last Yr</th></tr></thead>
                          <tbody>
                            <tr><td>Days</td><td className="text-right tabular-nums">30</td><td className="text-right tabular-nums">30</td></tr>
                            <tr><td>Units</td><td className="text-right tabular-nums">{consumption}</td><td className="text-right tabular-nums">{Math.round(consumption * 1.1)}</td></tr>
                            <tr><td>Litres</td><td className="text-right tabular-nums">{(consumption * 1000).toLocaleString()}</td><td className="text-right tabular-nums">{(Math.round(consumption * 1.1) * 1000).toLocaleString()}</td></tr>
                            <tr><td>Avg L/Day</td><td className="text-right tabular-nums">{Math.round(consumption * 1000 / 30)}</td><td className="text-right tabular-nums">{Math.round(consumption * 1100 / 30)}</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-primary">TIER RATE STRUCTURE</p>
                        <table className="mt-1 w-full text-[11px]">
                          <thead><tr className="text-muted-foreground"><th className="text-left">Rate / Unit</th><th className="text-right">Units</th></tr></thead>
                          <tbody>
                            {TIERS.map((t) => (
                              <tr key={t.name}>
                                <td>{t.name} <span className="tabular-nums">₹{t.rate.toFixed(2)}</span></td>
                                <td className="text-right text-muted-foreground">{t.range}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-semibold">Your Water Use History</p>
                      <BarsChart
                        data={usageHistory}
                        x="period"
                        series={[
                          { key: "you", label: "Your Usage" },
                          { key: "avg", label: "Area Average" },
                        ]}
                        height={140}
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-4 border-t pt-2 text-[10px] text-muted-foreground">
                  <span className="font-semibold">*Area Average</span> is based on meter reading routes separated into township zones:
                  North, Central, South, and East clusters of Bengaluru service area.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-3 pt-4 text-sm">
              {[
                ["Tiered Consumption Charges", tieredTotal],
                ["Service Charge", serviceCharge],
                ["Watershed Management Fee", watershedFee],
                ["Capital Maintenance Fee", capitalFee],
                ["Subtotal", subtotal],
                ["Tax (GST 18%)", tax],
                ["Previous Balance", previousBalance],
                ["Payments Received", -paymentsReceived],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium tabular-nums">{formatCurrency(v as number)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 text-base font-semibold">
                <span>Total Amount Due</span><span className="tabular-nums">{formatCurrency(total)}</span>
              </div>
            </TabsContent>

            <TabsContent value="meter" className="space-y-3 pt-4 text-sm">
              <Row k="Meter Number" v={meterNo} />
              <Row k="Meter Category" v="Flat Meter" />
              <Row k="Reading Unit" v="KL (Kiloliter)" />
              <Separator />
              <Row k="Previous Reading" v={`${priorReading}.00`} />
              <Row k="Current Reading" v={`${currentReading}.00`} />
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

function Line({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 ${bold ? "" : ""}`}>
      <span className={bold ? "" : "text-foreground"}>{k}</span>
      <span className="tabular-nums">{v}</span>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
