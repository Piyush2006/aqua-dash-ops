import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, SectionHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { StatusBadge } from "@/components/ui/status-badge";
import { User, Mail, Phone, MapPin, Hash, Gauge, Calendar } from "lucide-react";
import { consumer } from "@/mocks/portal";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/portal/profile")({ component: ProfilePage });

function ProfilePage() {
  const [form, setForm] = useState({
    mobile: consumer.mobile,
    altMobile: consumer.altMobile,
    email: consumer.email,
  });
  const [comms, setComms] = useState(consumer.comms);

  const save = () => toast.success("Profile updated successfully");

  return (
    <>
      <PageHeader title="My Profile" description="Manage your personal and contact details" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Personal */}
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <SectionHeader title="Personal details" description="Read-only — contact support to update" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ReadField icon={User} label="Full name" value={consumer.name} />
              <ReadField icon={Hash} label="Consumer ID" value={consumer.id} />
              <ReadField icon={Calendar} label="Joined" value={consumer.joinedAt} />
              <ReadField icon={User} label="Occupancy" value={consumer.occupancy} />
              <ReadField icon={User} label="KYC" value={<StatusBadge status={consumer.kyc} />} />
            </div>
          </div>

          {/* Contact info (editable) */}
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <SectionHeader title="Contact information" description="Used for bills, reminders and alerts" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Mobile</Label>
                <Input className="mt-1.5" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              </div>
              <div>
                <Label>Alternate mobile</Label>
                <Input className="mt-1.5" value={form.altMobile} onChange={(e) => setForm({ ...form, altMobile: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Email</Label>
                <Input className="mt-1.5" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={save}>Save changes</Button>
            </div>
          </div>

          {/* Communication prefs */}
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <SectionHeader title="Communication preferences" description="Choose how you want to hear from us" />
            <div className="space-y-3">
              {(["email", "sms", "whatsapp", "push"] as const).map((k) => (
                <div key={k} className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
                  <div>
                    <p className="text-sm font-medium capitalize">{k === "sms" ? "SMS" : k}</p>
                    <p className="text-xs text-muted-foreground">
                      {k === "email" && "Bills, statements and account updates"}
                      {k === "sms" && "Critical alerts and OTPs"}
                      {k === "whatsapp" && "Bill reminders and updates"}
                      {k === "push" && "In-app notifications"}
                    </p>
                  </div>
                  <Switch checked={comms[k]} onCheckedChange={(v) => { setComms({ ...comms, [k]: v }); toast.success(`${k} ${v ? "enabled" : "disabled"}`); }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: connection & address */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <SectionHeader title="Service address" />
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-foreground">{consumer.address}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <SectionHeader title="Connection details" />
            <div className="space-y-3 text-sm">
              <KV label="Connection No." value={consumer.connectionNo} />
              <KV label="Status" value={<StatusBadge status={consumer.connectionStatus} dot />} />
              <KV label="Meter ID" value={consumer.meterId} />
              <KV label="Meter Serial" value={consumer.meterSerial} />
              <KV label="Tariff Plan" value={consumer.tariff} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ReadField({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
