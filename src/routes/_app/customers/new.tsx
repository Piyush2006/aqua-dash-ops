import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, ArrowLeft, ArrowRight, Upload } from "lucide-react";
import { useState } from "react";
import { townships } from "@/mocks/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/customers/new")({ component: NewCustomer });

const steps = [
  { id: 1, title: "Personal", desc: "Basic identity & contact" },
  { id: 2, title: "Address", desc: "Township & flat details" },
  { id: 3, title: "KYC", desc: "Identity proof & verification" },
  { id: 4, title: "Connection", desc: "Tariff & billing setup" },
];

function NewCustomer() {
  const [step, setStep] = useState(1);
  const nav = useNavigate();
  const submit = () => { toast.success("Customer onboarded successfully"); nav({ to: "/customers" }); };

  return (
    <>
      <Link to="/customers" className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Back to consumers</Link>
      <PageHeader title="Onboard new consumer" description="Multi-step onboarding with KYC verification" />

      <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
        {/* Stepper */}
        <div className="rounded-xl border bg-card p-4 shadow-card">
          {steps.map((s, i) => (
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
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Connection type</Label>
                <Select defaultValue="domestic"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="domestic">Domestic</SelectItem><SelectItem value="commercial">Commercial</SelectItem><SelectItem value="bulk">Bulk</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Tariff</Label>
                <Select defaultValue="trf-001"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="trf-001">Residential-A Slab</SelectItem><SelectItem value="trf-002">Residential-B Slab</SelectItem><SelectItem value="trf-003">Commercial Standard</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Billing cycle</Label>
                <Select defaultValue="monthly"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="bimonthly">Bi-monthly</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Utility owner</Label>
                <Select defaultValue="prestige"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="prestige">Prestige Utilities</SelectItem><SelectItem value="sobha">Sobha Services</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
            <p className="text-xs text-muted-foreground">Step {step} of {steps.length}</p>
            {step < steps.length ? (
              <Button onClick={() => setStep((s) => s + 1)}>Continue <ArrowRight className="ml-1.5 h-4 w-4" /></Button>
            ) : (
              <Button onClick={submit}>Complete onboarding <Check className="ml-1.5 h-4 w-4" /></Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
