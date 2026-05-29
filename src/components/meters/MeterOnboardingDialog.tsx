import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { townships, meters, customers, tariffsList } from "@/mocks/data";
import { AlertCircle, Check, ChevronRight, Gauge, Network, User, Radio, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Category = "Township Meter" | "Block Meter" | "Cluster Meter" | "Flat Meter";

const tabs = [
  { id: "details", label: "Meter Details", icon: Gauge },
  { id: "hierarchy", label: "Hierarchy", icon: Network },
  { id: "consumer", label: "Consumer Assignment", icon: User },
  { id: "config", label: "Configuration", icon: Radio },
  { id: "review", label: "Review", icon: FileCheck },
] as const;

export function MeterOnboardingDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("details");

  // Details
  const [serial, setSerial] = useState("");
  const [type, setType] = useState("Smart IoT Meter");
  const [category, setCategory] = useState<Category>("Flat Meter");
  const [manufacturer, setManufacturer] = useState("Kamstrup");
  const [model, setModel] = useState("flowIQ 2200");
  const [installDate, setInstallDate] = useState("2025-12-01");
  const [unit, setUnit] = useState("KL");
  const [status, setStatus] = useState("Pending");

  // Hierarchy
  const [township, setTownship] = useState(townships[0].id);
  const [block, setBlock] = useState("C");
  const [cluster, setCluster] = useState("Cluster-1");
  const [flat, setFlat] = useState("C-1205");
  const [parentMeter, setParentMeter] = useState<string>("");

  // Consumer (only flat meters)
  const [consumerId, setConsumerId] = useState<string>("");
  const [assignmentDate, setAssignmentDate] = useState("2025-12-01");

  // Config
  const [initialReading, setInitialReading] = useState("");
  const [initialReadingDate, setInitialReadingDate] = useState("2025-12-01");
  const [frequency, setFrequency] = useState("Monthly");
  const [comms, setComms] = useState("LoRaWAN");
  const [deviceId, setDeviceId] = useState("");
  const [battery, setBattery] = useState("100");
  const [signal, setSignal] = useState("85");

  // Reset parent meter when category changes
  useEffect(() => { setParentMeter(""); }, [category]);

  const requiredParent: Record<Category, string | null> = {
    "Township Meter": null,
    "Block Meter": "Township Meter",
    "Cluster Meter": "Block Meter",
    "Flat Meter": "Cluster Meter",
  };

  // Parent candidates (mock: derive from meter ids and category labels)
  const parentCandidates = useMemo(() => {
    const need = requiredParent[category];
    if (!need) return [];
    // Synthetic parent list per township
    const tw = townships.find((t) => t.id === township)!;
    if (need === "Township Meter") return [{ id: `BULK-${tw.id}`, label: `${tw.name} — Bulk Inlet` }];
    if (need === "Block Meter") return ["A","B","C","D"].map((b)=>({ id: `BLK-${tw.id}-${b}`, label: `Block ${b} Meter — ${tw.name}` }));
    return ["Cluster-1","Cluster-2","Cluster-3"].map((c)=>({ id: `CLS-${tw.id}-${block}-${c}`, label: `${c} — Block ${block}` }));
  }, [category, township, block]);

  const hierarchyPath = useMemo(() => {
    const tw = townships.find((t) => t.id === township)?.name ?? "—";
    const parts: string[] = [tw];
    if (category !== "Township Meter") parts.push(`Block ${block}`);
    if (category === "Cluster Meter" || category === "Flat Meter") parts.push(cluster);
    if (category === "Flat Meter") parts.push(flat);
    return parts;
  }, [category, township, block, cluster, flat]);

  const consumer = customers.find((c) => c.id === consumerId);

  const errors = useMemo(() => {
    const e: string[] = [];
    if (!serial) e.push("Meter serial number is required");
    if (!initialReading) e.push("Initial Reading cannot be blank");
    if (!initialReadingDate) e.push("Initial Reading Date cannot be blank");
    const need = requiredParent[category];
    if (need && !parentMeter) e.push(`${category} must have a Parent ${need}`);
    if (category === "Flat Meter" && !consumerId) e.push("Consumer assignment is required for Flat Meters");
    return e;
  }, [serial, initialReading, initialReadingDate, category, parentMeter, consumerId]);

  const reset = () => {
    setTab("details"); setSerial(""); setInitialReading(""); setConsumerId(""); setParentMeter("");
  };

  const submit = () => {
    if (errors.length) { toast.error(errors[0]); return; }
    toast.success(`Meter ${serial} onboarded successfully`);
    setOpen(false); reset();
  };

  const next = () => {
    const order = tabs.map((t) => t.id);
    const i = order.indexOf(tab);
    if (i < order.length - 1) setTab(order[i + 1]);
  };
  const prev = () => {
    const order = tabs.map((t) => t.id);
    const i = order.indexOf(tab);
    if (i > 0) setTab(order[i - 1]);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Onboard a new meter</DialogTitle>
          <DialogDescription>Register meter, attach to hierarchy, assign consumer (flat meters only) and initialize baseline reading.</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="bg-surface justify-start">
            {tabs.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="gap-1.5">
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-y-auto pr-1 mt-4">
            <TabsContent value="details" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Meter serial number <span className="text-critical">*</span></Label><Input className="mt-1.5" value={serial} onChange={(e)=>setSerial(e.target.value)} placeholder="e.g. SN-2025-09812" /></div>
                <div><Label>Meter type</Label>
                  <Select value={type} onValueChange={setType}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Mechanical","Ultrasonic","Electromagnetic","Smart IoT Meter"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                </div>
                <div><Label>Meter category</Label>
                  <Select value={category} onValueChange={(v)=>setCategory(v as Category)}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{(["Township Meter","Block Meter","Cluster Meter","Flat Meter"] as Category[]).map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                </div>
                <div><Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Active","Pending","Faulty","Removed"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                </div>
                <div><Label>Manufacturer</Label><Input className="mt-1.5" value={manufacturer} onChange={(e)=>setManufacturer(e.target.value)} /></div>
                <div><Label>Model</Label><Input className="mt-1.5" value={model} onChange={(e)=>setModel(e.target.value)} /></div>
                <div><Label>Installation date</Label><Input className="mt-1.5" type="date" value={installDate} onChange={(e)=>setInstallDate(e.target.value)} /></div>
                <div><Label>Unit of measure</Label>
                  <Select value={unit} onValueChange={setUnit}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{["KL","Litres","Cubic Meter"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hierarchy" className="mt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Township</Label>
                  <Select value={township} onValueChange={setTownship}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{townships.map(t=><SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
                </div>
                {category !== "Township Meter" && (
                  <div><Label>Block</Label>
                    <Select value={block} onValueChange={setBlock}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["A","B","C","D","E"].map(b=><SelectItem key={b} value={b}>Block {b}</SelectItem>)}</SelectContent></Select>
                  </div>
                )}
                {(category === "Cluster Meter" || category === "Flat Meter") && (
                  <div><Label>Cluster</Label>
                    <Select value={cluster} onValueChange={setCluster}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Cluster-1","Cluster-2","Cluster-3"].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
                  </div>
                )}
                {category === "Flat Meter" && (
                  <div><Label>Flat number</Label><Input className="mt-1.5" value={flat} onChange={(e)=>setFlat(e.target.value)} /></div>
                )}
                {requiredParent[category] && (
                  <div className="col-span-2"><Label>Parent meter <span className="text-critical">*</span> <span className="text-xs text-muted-foreground">(must be {requiredParent[category]} and Active)</span></Label>
                    <Select value={parentMeter} onValueChange={setParentMeter}><SelectTrigger className="mt-1.5"><SelectValue placeholder={`Select parent ${requiredParent[category]?.toLowerCase()}`} /></SelectTrigger>
                    <SelectContent>{parentCandidates.map((p)=><SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}</SelectContent></Select>
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-surface p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hierarchy path preview</p>
                <div className="flex flex-wrap items-center gap-1.5 text-sm">
                  {hierarchyPath.map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="rounded-md border bg-background px-2 py-1 font-medium">{p}</span>
                      {i < hierarchyPath.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="consumer" className="mt-0 space-y-4">
              {category !== "Flat Meter" ? (
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm">
                  <p className="flex items-center gap-2 font-medium text-warning"><AlertCircle className="h-4 w-4" /> Consumer assignment not applicable</p>
                  <p className="mt-1 text-xs text-muted-foreground">Only Flat Meters can be linked to a consumer. Bulk / Block / Cluster meters meter shared infrastructure.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2"><Label>Consumer <span className="text-critical">*</span></Label>
                      <Select value={consumerId} onValueChange={setConsumerId}><SelectTrigger className="mt-1.5"><SelectValue placeholder="Search consumer..." /></SelectTrigger>
                      <SelectContent>{customers.slice(0,30).map(c=><SelectItem key={c.id} value={c.id}>{c.name} · {c.id} · {c.flat}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div><Label>Assignment effective date</Label><Input className="mt-1.5" type="date" value={assignmentDate} onChange={(e)=>setAssignmentDate(e.target.value)} /></div>
                  </div>

                  {consumer && (
                    <div className="rounded-lg border bg-surface p-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Consumer summary</p>
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div className="flex justify-between"><dt className="text-muted-foreground">Name</dt><dd className="font-medium">{consumer.name}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Customer ID</dt><dd className="font-mono text-xs">{consumer.id}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Connection type</dt><dd>{consumer.occupancy === "Owner" ? "Residential" : "Residential"}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Assigned tariff</dt><dd>{consumer.tariff}</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Utility owner</dt><dd>Prestige Utilities</dd></div>
                        <div className="flex justify-between"><dt className="text-muted-foreground">Admin owner</dt><dd>Block-{consumer.block} Admin</dd></div>
                      </dl>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="config" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Initial reading <span className="text-critical">*</span></Label><Input className="mt-1.5" type="number" value={initialReading} onChange={(e)=>setInitialReading(e.target.value)} placeholder="e.g. 0" /></div>
                <div><Label>Initial reading date <span className="text-critical">*</span></Label><Input className="mt-1.5" type="date" value={initialReadingDate} onChange={(e)=>setInitialReadingDate(e.target.value)} /></div>
                <div><Label>Reading frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Daily","Weekly","Monthly"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                </div>
                <div><Label>Communication type</Label>
                  <Select value={comms} onValueChange={setComms}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{["LoRaWAN","NB-IoT","GSM","WiFi"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                </div>
                <div><Label>Device ID</Label><Input className="mt-1.5" value={deviceId} onChange={(e)=>setDeviceId(e.target.value)} placeholder="EUI / IMEI" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Battery %</Label><Input className="mt-1.5" type="number" value={battery} onChange={(e)=>setBattery(e.target.value)} /></div>
                  <div><Label>Signal %</Label><Input className="mt-1.5" type="number" value={signal} onChange={(e)=>setSignal(e.target.value)} /></div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="review" className="mt-0 space-y-4">
              <div className="rounded-lg border bg-surface p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Meter information</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Serial</dt><dd className="font-mono text-xs">{serial || "—"}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd>{type}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Category</dt><dd>{category}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd>{status}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Manufacturer</dt><dd>{manufacturer} · {model}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Installed</dt><dd>{installDate}</dd></div>
                </dl>
              </div>

              <div className="rounded-lg border bg-surface p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hierarchy visualization</p>
                <div className="flex flex-wrap items-center gap-1.5 text-sm">
                  {hierarchyPath.map((p, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="rounded-md border bg-background px-2 py-1 font-medium">{p}</span>
                      {i < hierarchyPath.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Parent meter: <span className="font-mono">{parentMeter || "—"}</span></p>
              </div>

              {category === "Flat Meter" && (
                <div className="rounded-lg border bg-surface p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assigned consumer</p>
                  <p className="text-sm">{consumer ? `${consumer.name} · ${consumer.id}` : <span className="text-muted-foreground">No consumer selected</span>}</p>
                </div>
              )}

              <div className="rounded-lg border bg-surface p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Initial reading & communication</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Initial reading</dt><dd>{initialReading ? `${initialReading} ${unit}` : "—"}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Reading date</dt><dd>{initialReadingDate || "—"}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Frequency</dt><dd>{frequency}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Comms</dt><dd>{comms}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Device ID</dt><dd className="font-mono text-xs">{deviceId || "—"}</dd></div>
                  <div className="flex justify-between"><dt className="text-muted-foreground">Battery / Signal</dt><dd>{battery}% / {signal}%</dd></div>
                </dl>
              </div>

              {errors.length > 0 && (
                <div className="rounded-lg border border-critical/30 bg-critical/5 p-3">
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-critical"><AlertCircle className="h-3.5 w-3.5" /> Fix the following before submitting</p>
                  <ul className="ml-5 list-disc space-y-0.5 text-xs text-critical">{errors.map((e)=><li key={e}>{e}</li>)}</ul>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <Button variant="outline" onClick={prev} disabled={tab === tabs[0].id}>Back</Button>
          <p className="text-xs text-muted-foreground">{tabs.findIndex(t=>t.id===tab)+1} of {tabs.length}</p>
          {tab !== "review" ? (
            <Button onClick={next}>Continue</Button>
          ) : (
            <Button onClick={submit} disabled={errors.length > 0}><Check className="mr-1.5 h-4 w-4" /> Onboard meter</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// satisfy potential lint about unused cn
void cn; void meters; void tariffsList;
