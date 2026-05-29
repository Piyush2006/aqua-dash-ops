import { useMemo, useState, ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Copy, Archive, CheckCircle2, Clock, FileText, AlertCircle, Calculator } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/status-badge";

type Slab = { id: string; from: number; to: number | null; rate: number };
type Band = { id: string; start: string; end: string; rate: number };
type Season = { id: string; name: string; start: string; end: string; rate: number };
type Charge = { id: string; name: string; amount: number; recoverable: boolean };
type Version = { version: string; effectiveDate: string; createdBy: string; status: "Draft" | "Pending Approval" | "Approved" | "Active" | "Archived" };

const uid = () => Math.random().toString(36).slice(2, 9);

const initialSlabs: Slab[] = [
  { id: uid(), from: 0, to: 10, rate: 5 },
  { id: uid(), from: 11, to: 20, rate: 8 },
  { id: uid(), from: 21, to: null, rate: 12 },
];
const initialBands: Band[] = [
  { id: uid(), start: "00:00", end: "06:00", rate: 4 },
  { id: uid(), start: "06:00", end: "18:00", rate: 8 },
  { id: uid(), start: "18:00", end: "22:00", rate: 15 },
  { id: uid(), start: "22:00", end: "23:59", rate: 6 },
];
const initialSeasons: Season[] = [
  { id: uid(), name: "Summer", start: "2026-04-01", end: "2026-06-30", rate: 12 },
  { id: uid(), name: "Monsoon", start: "2026-07-01", end: "2026-09-30", rate: 7 },
  { id: uid(), name: "Winter", start: "2026-10-01", end: "2026-03-31", rate: 9 },
];
const initialCharges: Charge[] = [
  { id: uid(), name: "Security Deposit", amount: 2000, recoverable: true },
  { id: uid(), name: "Connection Fee", amount: 500, recoverable: false },
  { id: uid(), name: "Processing Fee", amount: 150, recoverable: false },
];
const initialVersions: Version[] = [
  { version: "v3.0", effectiveDate: "2026-01-01", createdBy: "Anita Rao", status: "Active" },
  { version: "v2.1", effectiveDate: "2025-07-01", createdBy: "Karthik Iyer", status: "Archived" },
  { version: "v2.0", effectiveDate: "2025-01-01", createdBy: "Karthik Iyer", status: "Archived" },
  { version: "v1.0", effectiveDate: "2024-01-01", createdBy: "S. Mehra", status: "Archived" },
];

type Model = "flat" | "slab" | "tou" | "seasonal" | "hybrid";

export function TariffBuilderDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("basic");

  // Basic
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("Residential");
  const [effFrom, setEffFrom] = useState("");
  const [effTo, setEffTo] = useState("");
  const [status, setStatus] = useState("Draft");
  const [description, setDescription] = useState("");

  // Pricing
  const [model, setModel] = useState<Model>("slab");
  const [flatRate, setFlatRate] = useState(7);
  const [slabs, setSlabs] = useState<Slab[]>(initialSlabs);

  // Time
  const [touEnabled, setTouEnabled] = useState(false);
  const [bands, setBands] = useState<Band[]>(initialBands);
  const [peakEnabled, setPeakEnabled] = useState(false);
  const [peakStart, setPeakStart] = useState("18:00");
  const [peakEnd, setPeakEnd] = useState("22:00");
  const [peakRate, setPeakRate] = useState(15);
  const [offPeakRate, setOffPeakRate] = useState(6);
  const [weekendEnabled, setWeekendEnabled] = useState(false);
  const [weekdayRate, setWeekdayRate] = useState(8);
  const [weekendRate, setWeekendRate] = useState(10);
  const [holidayEnabled, setHolidayEnabled] = useState(false);
  const [holidayCalendar, setHolidayCalendar] = useState("India - National");
  const [holidayRate, setHolidayRate] = useState(12);

  // Seasonal
  const [seasons, setSeasons] = useState<Season[]>(initialSeasons);

  // Charges
  const [fixedMonthly, setFixedMonthly] = useState(150);
  const [meterRent, setMeterRent] = useState(40);
  const [serviceCharge, setServiceCharge] = useState(25);
  const [connectionCharge, setConnectionCharge] = useState(0);
  const [minBill, setMinBill] = useState(100);
  const [maxBill, setMaxBill] = useState(50000);
  const [latePenalty, setLatePenalty] = useState(2);
  const [reconnectionFee, setReconnectionFee] = useState(500);
  const [charges, setCharges] = useState<Charge[]>(initialCharges);

  // Simulation
  const [sampleConsumption, setSampleConsumption] = useState(35);
  const [taxRate, setTaxRate] = useState(18);

  const consumptionCharge = useMemo(() => {
    if (model === "flat") return sampleConsumption * flatRate;
    if (model === "slab" || model === "hybrid") {
      let remaining = sampleConsumption;
      let total = 0;
      for (const s of slabs) {
        const upper = s.to ?? Infinity;
        const span = Math.max(0, Math.min(remaining, upper - s.from + 1));
        if (span <= 0) continue;
        total += span * s.rate;
        remaining -= span;
        if (remaining <= 0) break;
      }
      return total;
    }
    if (model === "tou") {
      const avg = bands.reduce((a, b) => a + b.rate, 0) / Math.max(bands.length, 1);
      return sampleConsumption * avg;
    }
    return 0;
  }, [model, sampleConsumption, flatRate, slabs, bands]);

  const fixedTotal = fixedMonthly + meterRent + serviceCharge;
  const subtotal = consumptionCharge + fixedTotal;
  const clamped = Math.min(Math.max(subtotal, minBill), maxBill);
  const taxes = (clamped * taxRate) / 100;
  const finalBill = clamped + taxes;

  const reset = () => {
    setTab("basic");
  };

  const submit = () => {
    if (!name || !code || !effFrom) {
      toast.error("Fill basic details: name, code, effective from");
      setTab("basic");
      return;
    }
    toast.success(`Tariff “${name}” created as Draft (v1.0)`);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[1100px] p-0 gap-0 max-h-[92vh] flex flex-col">
        <DialogHeader className="px-6 pt-5 pb-3 border-b">
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" />
                Tariff Builder
              </DialogTitle>
              <DialogDescription>Configure pricing rules, charges and approval workflow for a utility tariff plan.</DialogDescription>
            </div>
            <WorkflowTimeline current={status} />
          </div>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-3 border-b">
            <TabsList className="h-9 bg-transparent p-0 gap-1">
              {([
                ["basic", "Basic Details", true],
                ["pricing", "Pricing Rules", true],
                ["time", "Time Rules", model === "tou" || model === "hybrid"],
                ["seasonal", "Seasonal Rules", model === "seasonal" || model === "hybrid"],
                ["charges", "Charges", true],
                ["sim", "Simulation", true],
                ["history", "Version History", true],
              ] as const).filter(([, , show]) => show).map(([v, l]) => (
                <TabsTrigger key={v} value={v} className="data-[state=active]:bg-muted">{l}</TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* BASIC */}
            <TabsContent value="basic" className="mt-0 space-y-5">
              <SectionTitle>Plan identification</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tariff Name" required>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Residential Slab 2026" />
                </Field>
                <Field label="Tariff Code" required>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="RES-SLAB-2026" />
                </Field>
                <Field label="Consumer Category" required>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Residential", "Commercial", "Industrial", "Bulk"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Draft", "Pending Approval", "Approved", "Active"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Effective From" required>
                  <Input type="date" value={effFrom} onChange={(e) => setEffFrom(e.target.value)} />
                </Field>
                <Field label="Effective To">
                  <Input type="date" value={effTo} onChange={(e) => setEffTo(e.target.value)} />
                </Field>
              </div>
              <Field label="Description">
                <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Rationale, regulator references, approval notes..." />
              </Field>
            </TabsContent>

            {/* PRICING */}
            <TabsContent value="pricing" className="mt-0 space-y-5">
              <SectionTitle>Pricing model</SectionTitle>
              <RadioGroup value={model} onValueChange={(v) => setModel(v as Model)} className="grid grid-cols-4 gap-3">
                {[
                  { v: "flat", t: "Flat Rate", d: "Single rate per KL" },
                  { v: "slab", t: "Tiered / Slab", d: "Block pricing by usage" },
                  { v: "tou", t: "Time of Use", d: "Hourly band pricing" },
                  { v: "hybrid", t: "Hybrid", d: "Slab + time + season" },
                ].map((m) => (
                  <label key={m.v} htmlFor={`m-${m.v}`} className={`cursor-pointer rounded-lg border p-3 transition ${model === m.v ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem id={`m-${m.v}`} value={m.v} />
                      <span className="text-sm font-medium">{m.t}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground pl-6">{m.d}</p>
                  </label>
                ))}
              </RadioGroup>

              {model === "flat" && (
                <div className="rounded-lg border p-4">
                  <Field label="Rate per KL (₹)">
                    <Input type="number" value={flatRate} onChange={(e) => setFlatRate(+e.target.value)} />
                  </Field>
                </div>
              )}

              {(model === "slab" || model === "hybrid") && (
                <div className="rounded-lg border">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div>
                      <p className="text-sm font-medium">Slab / Tiered pricing</p>
                      <p className="text-xs text-muted-foreground">Define block ranges. Leave “To” empty for an open-ended top slab.</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSlabs([...slabs, { id: uid(), from: 0, to: null, rate: 0 }])}>
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add Slab
                    </Button>
                  </div>
                  <GridHeader cols={["From KL", "To KL", "Rate (₹/KL)", ""]} />
                  {slabs.map((s, i) => (
                    <div key={s.id} className="grid grid-cols-[1fr_1fr_1fr_40px] gap-2 px-4 py-2 border-b last:border-b-0 items-center">
                      <Input type="number" value={s.from} onChange={(e) => updateRow(slabs, setSlabs, i, { from: +e.target.value })} />
                      <Input type="number" value={s.to ?? ""} placeholder="∞" onChange={(e) => updateRow(slabs, setSlabs, i, { to: e.target.value === "" ? null : +e.target.value })} />
                      <Input type="number" value={s.rate} onChange={(e) => updateRow(slabs, setSlabs, i, { rate: +e.target.value })} />
                      <Button variant="ghost" size="icon" onClick={() => setSlabs(slabs.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                    </div>
                  ))}
                </div>
              )}

              {model === "tou" && (
                <p className="text-sm text-muted-foreground">Configure time bands in the <button className="text-primary underline-offset-2 hover:underline" onClick={() => setTab("time")}>Time Rules</button> tab.</p>
              )}
            </TabsContent>

            {/* TIME */}
            <TabsContent value="time" className="mt-0 space-y-5">
              <ToggleRow checked={touEnabled} onChange={setTouEnabled} title="Time of Use (TOU)" desc="Enable hourly time-band pricing." />
              {touEnabled && (
                <div className="rounded-lg border">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <p className="text-sm font-medium">Time bands</p>
                    <Button size="sm" variant="outline" onClick={() => setBands([...bands, { id: uid(), start: "00:00", end: "06:00", rate: 0 }])}>
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add Time Band
                    </Button>
                  </div>
                  <GridHeader cols={["Start Time", "End Time", "Rate (₹/KL)", ""]} />
                  {bands.map((b, i) => (
                    <div key={b.id} className="grid grid-cols-[1fr_1fr_1fr_40px] gap-2 px-4 py-2 border-b last:border-b-0 items-center">
                      <Input type="time" value={b.start} onChange={(e) => updateRow(bands, setBands, i, { start: e.target.value })} />
                      <Input type="time" value={b.end} onChange={(e) => updateRow(bands, setBands, i, { end: e.target.value })} />
                      <Input type="number" value={b.rate} onChange={(e) => updateRow(bands, setBands, i, { rate: +e.target.value })} />
                      <Button variant="ghost" size="icon" onClick={() => setBands(bands.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                    </div>
                  ))}
                </div>
              )}

              <ToggleRow checked={peakEnabled} onChange={setPeakEnabled} title="Peak / Off-Peak pricing" desc="Apply distinct rates during peak windows." />
              {peakEnabled && (
                <div className="grid grid-cols-4 gap-4 rounded-lg border p-4">
                  <Field label="Peak Start"><Input type="time" value={peakStart} onChange={(e) => setPeakStart(e.target.value)} /></Field>
                  <Field label="Peak End"><Input type="time" value={peakEnd} onChange={(e) => setPeakEnd(e.target.value)} /></Field>
                  <Field label="Peak Rate (₹/KL)"><Input type="number" value={peakRate} onChange={(e) => setPeakRate(+e.target.value)} /></Field>
                  <Field label="Off-Peak Rate (₹/KL)"><Input type="number" value={offPeakRate} onChange={(e) => setOffPeakRate(+e.target.value)} /></Field>
                </div>
              )}

              <ToggleRow checked={weekendEnabled} onChange={setWeekendEnabled} title="Weekday / Weekend differentiation" desc="Charge differently on Saturdays and Sundays." />
              {weekendEnabled && (
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <Field label="Weekday Rate (₹/KL)"><Input type="number" value={weekdayRate} onChange={(e) => setWeekdayRate(+e.target.value)} /></Field>
                  <Field label="Weekend Rate (₹/KL)"><Input type="number" value={weekendRate} onChange={(e) => setWeekendRate(+e.target.value)} /></Field>
                </div>
              )}

              <ToggleRow checked={holidayEnabled} onChange={setHolidayEnabled} title="Holiday pricing" desc="Apply special rates on calendared holidays." />
              {holidayEnabled && (
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <Field label="Holiday Calendar">
                    <Select value={holidayCalendar} onValueChange={setHolidayCalendar}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["India - National", "India - Karnataka", "India - Maharashtra", "Custom"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Holiday Rate (₹/KL)"><Input type="number" value={holidayRate} onChange={(e) => setHolidayRate(+e.target.value)} /></Field>
                </div>
              )}
            </TabsContent>

            {/* SEASONAL */}
            <TabsContent value="seasonal" className="mt-0 space-y-5">
              <div className="rounded-lg border">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div>
                    <p className="text-sm font-medium">Seasonal pricing</p>
                    <p className="text-xs text-muted-foreground">Define season windows and the applicable rate per KL.</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setSeasons([...seasons, { id: uid(), name: "", start: "", end: "", rate: 0 }])}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Season
                  </Button>
                </div>
                <GridHeader cols={["Season", "Start", "End", "Rate (₹/KL)", ""]} colsTemplate="2fr 1.2fr 1.2fr 1fr 40px" />
                {seasons.map((s, i) => (
                  <div key={s.id} className="grid grid-cols-[2fr_1.2fr_1.2fr_1fr_40px] gap-2 px-4 py-2 border-b last:border-b-0 items-center">
                    <Input value={s.name} onChange={(e) => updateRow(seasons, setSeasons, i, { name: e.target.value })} placeholder="e.g. Summer" />
                    <Input type="date" value={s.start} onChange={(e) => updateRow(seasons, setSeasons, i, { start: e.target.value })} />
                    <Input type="date" value={s.end} onChange={(e) => updateRow(seasons, setSeasons, i, { end: e.target.value })} />
                    <Input type="number" value={s.rate} onChange={(e) => updateRow(seasons, setSeasons, i, { rate: +e.target.value })} />
                    <Button variant="ghost" size="icon" onClick={() => setSeasons(seasons.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* CHARGES */}
            <TabsContent value="charges" className="mt-0 space-y-5">
              <SectionTitle>Fixed charges</SectionTitle>
              <div className="grid grid-cols-4 gap-4">
                <Field label="Fixed Monthly (₹)"><Input type="number" value={fixedMonthly} onChange={(e) => setFixedMonthly(+e.target.value)} /></Field>
                <Field label="Meter Rent (₹)"><Input type="number" value={meterRent} onChange={(e) => setMeterRent(+e.target.value)} /></Field>
                <Field label="Service Charge (₹)"><Input type="number" value={serviceCharge} onChange={(e) => setServiceCharge(+e.target.value)} /></Field>
                <Field label="Connection Charge (₹)"><Input type="number" value={connectionCharge} onChange={(e) => setConnectionCharge(+e.target.value)} /></Field>
              </div>
              <Separator />
              <SectionTitle>Billing controls</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Minimum Bill (₹)"><Input type="number" value={minBill} onChange={(e) => setMinBill(+e.target.value)} /></Field>
                <Field label="Maximum Bill (₹)"><Input type="number" value={maxBill} onChange={(e) => setMaxBill(+e.target.value)} /></Field>
              </div>
              <Separator />
              <SectionTitle>Penalty controls</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Late Payment Penalty (%)"><Input type="number" value={latePenalty} onChange={(e) => setLatePenalty(+e.target.value)} /></Field>
                <Field label="Reconnection Fee (₹)"><Input type="number" value={reconnectionFee} onChange={(e) => setReconnectionFee(+e.target.value)} /></Field>
              </div>
              <Separator />
              <div className="rounded-lg border">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div>
                    <p className="text-sm font-medium">Recoverable / Non-recoverable charges</p>
                    <p className="text-xs text-muted-foreground">One-time charges applied at onboarding or events.</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setCharges([...charges, { id: uid(), name: "", amount: 0, recoverable: false }])}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Charge
                  </Button>
                </div>
                <GridHeader cols={["Charge Name", "Amount (₹)", "Recoverable", ""]} colsTemplate="2fr 1fr 1fr 40px" />
                {charges.map((c, i) => (
                  <div key={c.id} className="grid grid-cols-[2fr_1fr_1fr_40px] gap-2 px-4 py-2 border-b last:border-b-0 items-center">
                    <Input value={c.name} onChange={(e) => updateRow(charges, setCharges, i, { name: e.target.value })} placeholder="e.g. Security Deposit" />
                    <Input type="number" value={c.amount} onChange={(e) => updateRow(charges, setCharges, i, { amount: +e.target.value })} />
                    <div className="flex items-center gap-2">
                      <Switch checked={c.recoverable} onCheckedChange={(v) => updateRow(charges, setCharges, i, { recoverable: v })} />
                      <span className="text-xs text-muted-foreground">{c.recoverable ? "Yes" : "No"}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setCharges(charges.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* SIMULATION */}
            <TabsContent value="sim" className="mt-0 space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <Field label="Sample Consumption (KL)">
                  <Input type="number" value={sampleConsumption} onChange={(e) => setSampleConsumption(+e.target.value)} />
                </Field>
                <Field label="Tax (GST %)">
                  <Input type="number" value={taxRate} onChange={(e) => setTaxRate(+e.target.value)} />
                </Field>
                <Field label="Pricing Model">
                  <Input value={model.toUpperCase()} disabled />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4 space-y-3">
                  <p className="text-sm font-medium flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Step-by-step calculation</p>
                  {(model === "slab" || model === "hybrid") && (
                    <div className="space-y-1.5">
                      {breakdownSlab(slabs, sampleConsumption).map((row, i) => (
                        <Row key={i} label={`Slab ${row.from}–${row.to ?? "∞"} KL × ₹${row.rate}`} value={`${row.units} KL = ₹${row.subtotal.toFixed(2)}`} />
                      ))}
                    </div>
                  )}
                  {model === "flat" && <Row label={`${sampleConsumption} KL × ₹${flatRate}`} value={`₹${(sampleConsumption * flatRate).toFixed(2)}`} />}
                  {model === "tou" && bands.map((b, i) => (
                    <Row key={i} label={`${b.start}–${b.end} avg`} value={`₹${b.rate}/KL`} />
                  ))}
                </div>

                <div className="rounded-lg border p-4 space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2"><Calculator className="h-4 w-4 text-primary" /> Bill summary</p>
                  <Row label="Consumption charges" value={`₹${consumptionCharge.toFixed(2)}`} />
                  <Row label="Fixed monthly" value={`₹${fixedMonthly.toFixed(2)}`} />
                  <Row label="Meter rent" value={`₹${meterRent.toFixed(2)}`} />
                  <Row label="Service charge" value={`₹${serviceCharge.toFixed(2)}`} />
                  <Separator />
                  <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
                  {clamped !== subtotal && <Row label={`Min/Max clamp applied`} value={`₹${clamped.toFixed(2)}`} muted />}
                  <Row label={`Taxes (${taxRate}% GST)`} value={`₹${taxes.toFixed(2)}`} />
                  <Separator />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-semibold">Final bill amount</span>
                    <span className="text-lg font-bold text-primary tabular-nums">₹{finalBill.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* HISTORY */}
            <TabsContent value="history" className="mt-0 space-y-5">
              <div className="rounded-lg border">
                <GridHeader cols={["Version", "Effective", "Created by", "Status", "Actions"]} colsTemplate="1fr 1.2fr 1.5fr 1.2fr 1.6fr" />
                {initialVersions.map((v) => (
                  <div key={v.version} className="grid grid-cols-[1fr_1.2fr_1.5fr_1.2fr_1.6fr] gap-2 px-4 py-2.5 border-b last:border-b-0 items-center">
                    <span className="font-mono text-xs font-medium">{v.version}</span>
                    <span className="text-sm">{v.effectiveDate}</span>
                    <span className="text-sm">{v.createdBy}</span>
                    <StatusBadge status={v.status} dot />
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => toast.success(`Cloned ${v.version}`)}><Copy className="h-3.5 w-3.5 mr-1" />Clone</Button>
                      <Button variant="ghost" size="sm" onClick={() => toast.success(`Activated ${v.version}`)}><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Activate</Button>
                      <Button variant="ghost" size="sm" onClick={() => toast.success(`Archived ${v.version}`)}><Archive className="h-3.5 w-3.5 mr-1" />Archive</Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Approval history</p>
                <div className="space-y-3">
                  {[
                    { user: "Anita Rao", action: "Created draft", time: "2026-01-12 09:14" },
                    { user: "Anita Rao", action: "Submitted for approval", time: "2026-01-12 09:42" },
                    { user: "S. Mehra", action: "Approved", time: "2026-01-13 11:05" },
                    { user: "System", action: "Activated", time: "2026-01-15 00:00" },
                  ].map((e, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p><span className="font-medium">{e.user}</span> <span className="text-muted-foreground">{e.action}</span></p>
                        <p className="text-xs text-muted-foreground">{e.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="px-6 py-4 border-t flex items-center justify-between sm:justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5" />
            Drafts require approval before activation.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => { toast.success("Saved as draft"); setOpen(false); }}>Save Draft</Button>
            <Button onClick={submit}>Submit for Approval</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function updateRow<T>(arr: T[], setArr: (v: T[]) => void, i: number, patch: Partial<T>) {
  setArr(arr.map((r, j) => (j === i ? { ...r, ...patch } : r)));
}

function breakdownSlab(slabs: Slab[], consumption: number) {
  let remaining = consumption;
  const rows: { from: number; to: number | null; rate: number; units: number; subtotal: number }[] = [];
  for (const s of slabs) {
    const upper = s.to ?? Infinity;
    const span = Math.max(0, Math.min(remaining, upper - s.from + 1));
    if (span <= 0) { rows.push({ ...s, units: 0, subtotal: 0 }); continue; }
    rows.push({ ...s, units: span, subtotal: span * s.rate });
    remaining -= span;
  }
  return rows;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-critical"> *</span>}</Label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h4 className="text-sm font-semibold text-foreground">{children}</h4>;
}

function GridHeader({ cols, colsTemplate }: { cols: string[]; colsTemplate?: string }) {
  const template = colsTemplate ?? cols.map((_, i) => (i === cols.length - 1 ? "40px" : "1fr")).join(" ");
  return (
    <div className="grid gap-2 px-4 py-2 bg-muted/40 border-b text-xs font-medium text-muted-foreground uppercase tracking-wide" style={{ gridTemplateColumns: template }}>
      {cols.map((c, i) => <span key={i}>{c}</span>)}
    </div>
  );
}

function ToggleRow({ checked, onChange, title, desc }: { checked: boolean; onChange: (v: boolean) => void; title: string; desc: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-sm ${muted ? "text-muted-foreground" : ""}`}>
      <span>{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}

function WorkflowTimeline({ current }: { current: string }) {
  const steps = ["Draft", "Pending Approval", "Approved", "Active"];
  const idx = Math.max(0, steps.indexOf(current));
  return (
    <div className="hidden md:flex items-center gap-1.5">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5">
          <Badge variant={i <= idx ? "default" : "outline"} className="text-[10px] font-medium">{s}</Badge>
          {i < steps.length - 1 && <span className={`h-px w-3 ${i < idx ? "bg-primary" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}
