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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Gauge, Layers, Calendar, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { townships, formatNumber } from "@/mocks/data";

type Scope = "township" | "block" | "cluster" | "individual";
type ScheduleType = "daily" | "weekly" | "monthly" | "custom";
type Method = "iot" | "manual" | "csv" | "api";

export type ReadCycleInitial = Partial<{ name: string; code: string; desc: string; active: boolean }>;

export function ReadCycleBuilderDialog({ trigger, initial, mode = "create" }: { trigger: ReactNode; initial?: ReadCycleInitial; mode?: "create" | "edit" }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("basic");
  const isEdit = mode === "edit";

  // Basic
  const [name, setName] = useState(initial?.name ?? "");
  const [code, setCode] = useState(initial?.code ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [active, setActive] = useState(initial?.active ?? true);

  // Selection
  const [scope, setScope] = useState<Scope>("township");
  const [selectedTownships, setSelectedTownships] = useState<string[]>([townships[0].id]);

  // Schedule
  const [scheduleType, setScheduleType] = useState<ScheduleType>("monthly");
  const [method, setMethod] = useState<Method>("iot");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("23:00");

  const counts = useMemo(() => {
    const total = selectedTownships.reduce((acc, id) => {
      const t = townships.find((x) => x.id === id);
      return acc + (t?.flats ?? 0);
    }, 0);
    const flat = Math.round(total * 0.92);
    const cluster = Math.round(total * 0.06);
    return { total, flat, cluster };
  }, [selectedTownships]);

  const toggleTownship = (id: string) =>
    setSelectedTownships((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const save = (draft?: boolean) => {
    if (!name) { toast.error("Cycle name is required"); setTab("basic"); return; }
    toast.success(draft ? "Saved as draft" : isEdit ? `Read cycle ${code || name} updated` : `Read cycle ${code || name} created`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-5xl p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" /> {isEdit ? `Edit Read Cycle${initial?.name ? ` — ${initial.name}` : ""}` : "Meter Read Cycle Builder"}
          </DialogTitle>
          <DialogDescription>Group meters and define when reads are collected. No billing logic.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="selection">Meter Selection</TabsTrigger>
              <TabsTrigger value="schedule">Read Schedule</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>Cycle Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly Residential" />
                </div>
                <div className="grid gap-1.5">
                  <Label>Cycle Code</Label>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. RC-MR-01" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label>Description</Label>
                <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Purpose of this cycle..." />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-xs text-muted-foreground">Inactive cycles do not collect reads.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={active} onCheckedChange={setActive} />
                  <Badge variant={active ? "default" : "secondary"}>{active ? "Active" : "Inactive"}</Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="selection" className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label>Group Meters By</Label>
                <RadioGroup value={scope} onValueChange={(v) => setScope(v as Scope)} className="grid grid-cols-4 gap-2">
                  {[
                    { v: "township", l: "Township" },
                    { v: "block", l: "Block" },
                    { v: "cluster", l: "Cluster" },
                    { v: "individual", l: "Individual" },
                  ].map((o) => (
                    <label key={o.v} className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-accent">
                      <RadioGroupItem value={o.v} /> <span className="text-sm">{o.l}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="rounded-lg border">
                <div className="border-b bg-muted/40 p-3 text-xs font-medium uppercase text-muted-foreground">Select Townships</div>
                <div className="max-h-64 divide-y overflow-y-auto">
                  {townships.map((t) => (
                    <label key={t.id} className="flex cursor-pointer items-center gap-3 p-3 hover:bg-accent/50">
                      <Checkbox checked={selectedTownships.includes(t.id)} onCheckedChange={() => toggleTownship(t.id)} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.city} · {formatNumber(t.flats)} flats</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <KPI label="Selected Meters" value={formatNumber(counts.total)} />
                <KPI label="Flat Meters" value={formatNumber(counts.flat)} />
                <KPI label="Cluster Meters" value={formatNumber(counts.cluster)} />
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label>Schedule Type</Label>
                  <Select value={scheduleType} onValueChange={(v) => setScheduleType(v as ScheduleType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Reading Method</Label>
                  <Select value={method} onValueChange={(v) => setMethod(v as Method)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="iot">IoT Automatic</SelectItem>
                      <SelectItem value="manual">Manual Entry</SelectItem>
                      <SelectItem value="csv">CSV Upload</SelectItem>
                      <SelectItem value="api">API Push</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Run Time</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-md border border-info/30 bg-info-soft/40 p-3 text-xs text-info">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>Read cycles only schedule reading collection — tariffs, bills and payments are configured elsewhere.</p>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4 pt-4">
              <div className="rounded-lg border">
                <div className="border-b bg-muted/40 p-3 text-sm font-semibold">Cycle Summary</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-4 text-sm">
                  <Row k="Cycle Name" v={name || "—"} />
                  <Row k="Cycle Code" v={code || "—"} />
                  <Row k="Total Assigned Meters" v={formatNumber(counts.total)} />
                  <Row k="Reading Method" v={method.toUpperCase()} />
                  <Row k="Schedule" v={`${scheduleType} · ${time}`} />
                  <Row k="Status" v={active ? "Active" : "Inactive"} />
                  <Row k="Start" v={startDate || "—"} />
                  <Row k="End" v={endDate || "—"} />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                <KPI label="Total Meters" value={formatNumber(counts.total)} />
                <KPI label="Scheduled Reads" value={formatNumber(counts.total)} tone="info" />
                <KPI label="Completed" value="0" tone="success" />
                <KPI label="Pending" value={formatNumber(counts.total)} tone="warning" />
                <KPI label="Failed" value="0" tone="critical" />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {(() => {
          const visible = ["basic", "selection", "schedule", "summary"];
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
                  <Button onClick={() => save(false)}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Create Cycle</Button>
                )}
              </div>
            </DialogFooter>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone?: "info" | "success" | "warning" | "critical" }) {
  const t = tone === "info" ? "text-info" : tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "critical" ? "text-critical" : "text-foreground";
  return (
    <div className="rounded-md border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${t}`}>{value}</p>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium text-foreground">{v}</span>
    </div>
  );
}
