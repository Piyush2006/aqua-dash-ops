import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Check, ArrowLeft, ArrowRight, Upload, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { townships, tariffsList } from "@/mocks/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/customers/new")({ component: NewCustomer });

const steps = [
  { id: 1, title: "Personal", desc: "Basic identity & contact" },
  { id: 2, title: "Address", desc: "Township & flat details" },
  { id: 3, title: "KYC", desc: "Identity proof & verification" },
  { id: 4, title: "Connection & Billing", desc: "Tariff, baseline reading & review" },
];

function NewCustomer() {
  const [step, setStep] = useState(1);
  const nav = useNavigate();

  // Step 4 state
  const [connectionType, setConnectionType] = useState("Residential");
  const [connectionStatus, setConnectionStatus] = useState("Active");
  const [connectionStart, setConnectionStart] = useState("2025-12-01");
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [tariff, setTariff] = useState(tariffsList[0].id);
  const [utilityOwner, setUtilityOwner] = useState("Prestige Utilities");
  const [adminOwner, setAdminOwner] = useState("Block-C Admin");

  const [initialReading, setInitialReading] = useState("");
  const [initialReadingDate, setInitialReadingDate] = useState("2025-12-01");
  const [securityDeposit, setSecurityDeposit] = useState("2000");
  const [billStartMonth, setBillStartMonth] = useState("2026-01");
  const [lastBillingDate, setLastBillingDate] = useState("");
  const [proratedBilling, setProratedBilling] = useState(true);

  const [readingSource, setReadingSource] = useState("New Connection");
  const [readingUnit, setReadingUnit] = useState("KL");

  const errors = useMemo(() => {
    const e: string[] = [];
    if (!initialReading) e.push("Initial Meter Reading cannot be blank");
    if (!initialReadingDate) e.push("Initial Meter Reading Date cannot be blank");
    if (!billStartMonth) e.push("Bill Generation Start Month must be selected");
    if (connectionStart && initialReadingDate && connectionStart > initialReadingDate)
      e.push("Connection Start Date cannot be after Initial Meter Reading Date");
    return e;
  }, [initialReading, initialReadingDate, billStartMonth, connectionStart]);

  const submit = () => {
    if (errors.length) { toast.error(errors[0]); return; }
    toast.success("Consumer onboarded successfully");
    nav({ to: "/customers" });
  };

  const tariffName = tariffsList.find((t) => t.id === tariff)?.name ?? "—";

  return (
    <>
      <Link to="/customers" className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Back to consumers</Link>
      <PageHeader title="Onboard new consumer" description="Multi-step onboarding with KYC & billing baseline" />

      <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
        {/* Stepper */}
        <div className="rounded-xl border bg-card p-4 shadow-card h-fit">
          {steps.map((s) => (
            <div key={s.id} className={cn("flex gap-3 rounded-lg p-2", step === s.id && "bg-primary/5")}>
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold", step > s.id ? "bg-success text-success-foreground" : step === s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
              </div>
              <div>
                <p className={cn("text-sm font-medium", step >= s.id ? "text-foreground" : "text-muted-foreground")}>{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-card">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div><Label>First name</Label><Input className="mt-1.5" defaultValue="Ananya" /></div>
              <div><Label>Last name</Label><Input className="mt-1.5" defaultValue="Sharma" /></div>
              <div><Label>Mobile</Label><Input className="mt-1.5" defaultValue="+91 98765 43210" /></div>
              <div><Label>Email</Label><Input className="mt-1.5" type="email" defaultValue="ananya@example.com" /></div>
              <div className="col-span-2"><Label>Occupancy</Label>
                <Select defaultValue="Owner"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Owner">Owner</SelectItem><SelectItem value="Tenant">Tenant</SelectItem><SelectItem value="Vacant">Vacant</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Label>Township</Label>
                <Select defaultValue={townships[0].id}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{townships.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Block</Label><Input className="mt-1.5" defaultValue="C" /></div>
              <div><Label>Floor</Label><Input className="mt-1.5" defaultValue="12" /></div>
              <div><Label>Flat number</Label><Input className="mt-1.5" defaultValue="C-1205" /></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Aadhaar</Label><Input className="mt-1.5" placeholder="XXXX XXXX XXXX" /></div>
                <div><Label>PAN</Label><Input className="mt-1.5" placeholder="ABCDE1234F" /></div>
                <div className="col-span-2"><Label>GST (optional)</Label><Input className="mt-1.5" /></div>
              </div>
              <div className="rounded-lg border border-dashed p-6 text-center">
                <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-medium">Upload ID proof</p>
                <p className="text-xs text-muted-foreground">PDF, JPG or PNG up to 5MB</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.success("Document uploaded")}>Select file</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              {/* Connection Details */}
              <section>
                <p className="mb-3 text-sm font-semibold">Connection Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Connection type <span className="text-critical">*</span></Label>
                    <Select value={connectionType} onValueChange={setConnectionType}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Residential","Commercial","Industrial","Bulk"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label>Connection status</Label>
                    <Select value={connectionStatus} onValueChange={setConnectionStatus}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Active","Pending","Disconnected"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label>Connection start date <span className="text-critical">*</span></Label>
                    <Input type="date" className="mt-1.5" value={connectionStart} onChange={(e)=>setConnectionStart(e.target.value)} />
                  </div>
                  <div><Label>Billing cycle</Label>
                    <Select value={billingCycle} onValueChange={setBillingCycle}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Monthly","Bi-monthly","Quarterly"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label>Assigned tariff <span className="text-critical">*</span></Label>
                    <Select value={tariff} onValueChange={setTariff}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{tariffsList.map(t=><SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label>Utility owner</Label>
                    <Select value={utilityOwner} onValueChange={setUtilityOwner}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Prestige Utilities","Sobha Services","DLF Utilities"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div className="col-span-2"><Label>Admin owner</Label>
                    <Select value={adminOwner} onValueChange={setAdminOwner}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Block-A Admin","Block-B Admin","Block-C Admin","Block-D Admin"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>
              </section>

              {/* Billing Initialization */}
              <section className="border-t pt-5">
                <p className="mb-1 text-sm font-semibold">Billing Initialization</p>
                <p className="mb-3 text-xs text-muted-foreground">Baseline reading used for future consumption & billing calculations.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Initial meter reading <span className="text-critical">*</span></Label>
                    <Input className="mt-1.5" type="number" placeholder="e.g. 0" value={initialReading} onChange={(e)=>setInitialReading(e.target.value)} />
                  </div>
                  <div><Label>Initial meter reading date <span className="text-critical">*</span></Label>
                    <Input className="mt-1.5" type="date" value={initialReadingDate} onChange={(e)=>setInitialReadingDate(e.target.value)} />
                  </div>
                  <div><Label>Security deposit (₹)</Label>
                    <Input className="mt-1.5" type="number" value={securityDeposit} onChange={(e)=>setSecurityDeposit(e.target.value)} />
                  </div>
                  <div><Label>Bill generation start month <span className="text-critical">*</span></Label>
                    <Input className="mt-1.5" type="month" value={billStartMonth} onChange={(e)=>setBillStartMonth(e.target.value)} />
                  </div>
                  <div><Label>Last billing date (if migrated)</Label>
                    <Input className="mt-1.5" type="date" value={lastBillingDate} onChange={(e)=>setLastBillingDate(e.target.value)} />
                  </div>
                  <div className="flex items-end gap-3 rounded-lg border bg-surface px-3 py-2.5">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Enable prorated billing</p>
                      <p className="text-xs text-muted-foreground">Pro-rate first bill by days active</p>
                    </div>
                    <Switch checked={proratedBilling} onCheckedChange={setProratedBilling} />
                  </div>
                </div>
              </section>

              {/* Initial Reading Information */}
              <section className="border-t pt-5">
                <p className="mb-3 text-sm font-semibold">Initial Reading Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Reading source</Label>
                    <Select value={readingSource} onValueChange={setReadingSource}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["New Connection","Existing Consumer Migration","Manual Entry"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div><Label>Reading unit</Label>
                    <Select value={readingUnit} onValueChange={setReadingUnit}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["KL","Litres","Cubic Meter"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                  </div>
                </div>
              </section>

              {/* Review & Summary */}
              <section className="border-t pt-5">
                <p className="mb-3 text-sm font-semibold">Review & Summary</p>
                <div className="rounded-lg border bg-surface p-4">
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                    <div className="flex justify-between"><dt className="text-muted-foreground">Connection type</dt><dd className="font-medium">{connectionType}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd className="font-medium">{connectionStatus}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Assigned tariff</dt><dd className="font-medium">{tariffName}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Billing cycle</dt><dd className="font-medium">{billingCycle}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Connection start</dt><dd className="font-medium">{connectionStart || "—"}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Initial reading</dt><dd className="font-medium">{initialReading ? `${initialReading} ${readingUnit}` : "—"}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Initial reading date</dt><dd className="font-medium">{initialReadingDate || "—"}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">First bill month</dt><dd className="font-medium">{billStartMonth || "—"}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Prorated</dt><dd className="font-medium">{proratedBilling ? "Yes" : "No"}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted-foreground">Utility / Admin owner</dt><dd className="font-medium text-right">{utilityOwner} / {adminOwner}</dd></div>
                  </dl>
                </div>

                {errors.length > 0 && (
                  <div className="mt-3 rounded-lg border border-critical/30 bg-critical/5 p-3">
                    <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-critical"><AlertCircle className="h-3.5 w-3.5" /> Fix the following before submitting</p>
                    <ul className="ml-5 list-disc space-y-0.5 text-xs text-critical">
                      {errors.map((e) => <li key={e}>{e}</li>)}
                    </ul>
                  </div>
                )}

                <p className="mt-3 text-xs text-muted-foreground">Meter assignment is handled separately from Meter Operations once onboarding is complete.</p>
              </section>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
            <p className="text-xs text-muted-foreground">Step {step} of {steps.length}</p>
            {step < steps.length ? (
              <Button onClick={() => setStep((s) => s + 1)}>Continue <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
            ) : (
              <Button onClick={submit} disabled={errors.length > 0}>Complete onboarding <Check className="ml-1.5 h-4 w-4" /></Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
