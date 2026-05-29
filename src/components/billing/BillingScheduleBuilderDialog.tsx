import { ReactNode, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Receipt, Eye, CheckCircle2, AlertCircle, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { townships, tariffsList, formatCurrency, formatNumber } from "@/mocks/data";

type Scope = "all" | "township" | "block" | "owner" | "group" | "individual";
type PeriodType = "monthly" | "custom";

export type BillingScheduleInitial = Partial<{
  name: string; code: string; desc: string; active: boolean;
  periodStart: string; periodEnd: string; genDate: string;
}>;

export function BillingScheduleBuilderDialog({ trigger, initial, mode = "create" }: { trigger: ReactNode; initial?: BillingScheduleInitial; mode?: "create" | "edit" }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("basic");
  const isEdit = mode === "edit";

  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [active, setActive] = useState(initial?.active ?? true);

  const [scope, setScope] = useState<Scope>("all");
  const [selectedTownships, setSelectedTownships] = useState<string[]>([]);

  const [periodType, setPeriodType] = useState<PeriodType>("monthly");
  const [periodStart, setPeriodStart] = useState(initial?.periodStart ?? "2026-01-01");
  const [periodEnd, setPeriodEnd] = useState(initial?.periodEnd ?? "2026-01-31");
  const [genDate, setGenDate] = useState(initial?.genDate ?? "2026-02-05");
  const [tariff, setTariff] = useState(tariffsList[0]?.id ?? "");

  const customers = useMemo(() => {
    if (scope === "all") return townships.reduce((a, t) => a + t.flats, 0);
    if (scope === "township" && selectedTownships.length) {
      return selectedTownships.reduce((a, id) => a + (townships.find((t) => t.id === id)?.flats ?? 0), 0);
    }
    return 0;
  }, [scope, selectedTownships]);

  const totalConsumption = customers * 18; // avg KL
  const estRevenue = totalConsumption * 72;

  const toggleTownship = (id: string) =>
    setSelectedTownships((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const save = (draft?: boolean) => {
    if (!name) { toast.error("Schedule name required"); setTab("basic"); return; }
    toast.success(draft ? "Schedule saved as draft" : isEdit ? `Billing schedule ${name} updated` : `Billing schedule ${name} scheduled for ${genDate}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-5xl p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" /> {isEdit ? `Edit Schedule${initial?.name ? ` — ${initial.name}` : ""}` : "Billing Schedule Builder"}</DialogTitle>
          <DialogDescription>Generate bills using consumption from a selected billing period.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="period">Billing Period</TabsTrigger>
              <TabsTrigger value="generation">Generation</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Schedule Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. January Residential Run" /></div>
                <div className="grid gap-1.5"><Label>Schedule Code</Label><Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="BS-JAN-RES" /></div>
              </div>
              <div className="grid gap-1.5"><Label>Description</Label><Textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div><p className="text-sm font-medium">Status</p><p className="text-xs text-muted-foreground">Inactive schedules will not auto-run.</p></div>
                <div className="flex items-center gap-2"><Switch checked={active} onCheckedChange={setActive} /><Badge variant={active ? "default" : "secondary"}>{active ? "Active" : "Inactive"}</Badge></div>
              </div>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label>Customer Scope</Label>
                <RadioGroup value={scope} onValueChange={(v) => setScope(v as Scope)} className="grid grid-cols-3 gap-2">
                  {[
                    { v: "all", l: "All Customers" },
                    { v: "township", l: "Township" },
                    { v: "block", l: "Block" },
                    { v: "owner", l: "Utility Owner" },
                    { v: "group", l: "Consumer Group" },
                    { v: "individual", l: "Individual" },
                  ].map((o) => (
                    <label key={o.v} className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-accent">
                      <RadioGroupItem value={o.v} /> <span className="text-sm">{o.l}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              {scope === "township" && (
                <div className="rounded-lg border">
                  <div className="border-b bg-muted/40 p-3 text-xs font-medium uppercase text-muted-foreground">Townships</div>
                  <div className="max-h-56 divide-y overflow-y-auto">
                    {townships.map((t) => (
                      <label key={t.id} className="flex cursor-pointer items-center gap-3 p-3 hover:bg-accent/50">
                        <Checkbox checked={selectedTownships.includes(t.id)} onCheckedChange={() => toggleTownship(t.id)} />
                        <div className="flex-1"><p className="text-sm font-medium">{t.name}</p><p className="text-xs text-muted-foreground">{formatNumber(t.flats)} flats</p></div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-md border bg-card p-3">
                <p className="text-xs text-muted-foreground">Selected Customer Count</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{formatNumber(customers)}</p>
              </div>
            </TabsContent>

            <TabsContent value="period" className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label>Billing Period Type</Label>
                <RadioGroup value={periodType} onValueChange={(v) => setPeriodType(v as PeriodType)} className="grid grid-cols-2 gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-accent"><RadioGroupItem value="monthly" /> Monthly</label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-accent"><RadioGroupItem value="custom" /> Custom</label>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Billing Start</Label><Input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} /></div>
                <div className="grid gap-1.5"><Label>Billing End</Label><Input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} /></div>
              </div>
              <div className="flex items-start gap-2 rounded-md border border-info/30 bg-info-soft/40 p-3 text-xs text-info">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Consumption recorded between <strong>{periodStart}</strong> and <strong>{periodEnd}</strong> will be used for bill calculation.</p>
              </div>
            </TabsContent>

            <TabsContent value="generation" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5"><Label>Bill Generation Date</Label><Input type="date" value={genDate} onChange={(e) => setGenDate(e.target.value)} /></div>
                <div className="grid gap-1.5">
                  <Label>Default Tariff</Label>
                  <Select value={tariff} onValueChange={setTariff}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{tariffsList.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-lg border">
                <div className="border-b bg-muted/40 p-3 text-sm font-semibold">Billing Calculation Engine</div>
                <ul className="grid grid-cols-2 gap-2 p-4 text-sm">
                  {["Fetch customer tariff","Fetch consumption for period","Apply slab pricing","Apply TOU pricing","Apply seasonal pricing","Apply fixed charges","Apply penalties","Apply taxes (GST)","Generate bill"].map((s) => (
                    <li key={s} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> {s}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <KPI label="Customer Count" value={formatNumber(customers)} />
                <KPI label="Total Consumption" value={`${formatNumber(totalConsumption)} KL`} tone="info" />
                <KPI label="Estimated Revenue" value={formatCurrency(estRevenue)} tone="success" />
                <KPI label="Generation Date" value={genDate} tone="warning" />
              </div>
              <div className="rounded-lg border">
                <div className="border-b bg-muted/40 p-3 text-sm font-semibold">Billing Window</div>
                <div className="grid grid-cols-3 gap-x-6 gap-y-3 p-4 text-sm">
                  <Row k="Period" v={`${periodStart} → ${periodEnd}`} />
                  <Row k="Generate On" v={genDate} />
                  <Row k="Tariff" v={tariffsList.find((t) => t.id === tariff)?.name ?? "—"} />
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => toast.success("Sample bills generated for 5 customers")}><Eye className="mr-1.5 h-4 w-4" /> Preview Sample Bills</Button>
            </TabsContent>
          </Tabs>
        </div>

        {(() => {
          const visible = ["basic", "customers", "period", "generation", "preview"];
          const idx = Math.max(0, visible.indexOf(tab));
          const isLast = idx === visible.length - 1;
          return (
            <DialogFooter className="border-t bg-muted/30 px-6 py-3 flex items-center justify-between sm:justify-between gap-2">
              <Button variant="outline" onClick={() => save(true)}>Save Draft</Button>
              <p className="text-xs text-muted-foreground">Step {idx + 1} of {visible.length}</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setTab(visible[idx - 1])} disabled={idx === 0}>Back</Button>
                {!isLast ? (
                  <Button onClick={() => setTab(visible[idx + 1])}>Continue</Button>
                ) : (
                  <Button onClick={() => save(false)}><IndianRupee className="mr-1.5 h-4 w-4" /> Schedule Billing</Button>
                )}
              </div>
            </DialogFooter>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone?: "info" | "success" | "warning" }) {
  const t = tone === "info" ? "text-info" : tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="rounded-md border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${t}`}>{value}</p>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">{k}</span><span className="font-medium text-foreground">{v}</span></div>;
}
