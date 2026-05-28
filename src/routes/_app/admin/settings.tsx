import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/settings")({ component: Page });

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-5">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="sm:w-72">{children}</div>
    </div>
  );
}

function Page() {
  return (
    <>
      <PageHeader title="System Settings" description="Organisation, regional and compliance preferences" actions={
        <Button size="sm" onClick={() => toast.success("Settings saved")}>Save changes</Button>
      } />
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Organisation" description="Tenant identity used across the platform">
          <Row label="Display name"><Input defaultValue="Smart Utility Operations" /></Row>
          <Row label="GSTIN" hint="Used on invoices"><Input defaultValue="29ABCDE1234F1Z5" /></Row>
          <Row label="Support email"><Input defaultValue="support@utility.io" /></Row>
        </Section>
        <Section title="Regional" description="Default currency, timezone and locale">
          <Row label="Currency"><Input defaultValue="INR (₹)" /></Row>
          <Row label="Timezone"><Input defaultValue="Asia/Kolkata (UTC+5:30)" /></Row>
          <Row label="Date format"><Input defaultValue="DD MMM YYYY" /></Row>
        </Section>
        <Section title="Billing Defaults" description="Applied when not overridden by tariff">
          <Row label="Late payment fee" hint="Flat amount in ₹"><Input defaultValue="150" /></Row>
          <Row label="Grace period (days)"><Input defaultValue="7" /></Row>
          <Row label="Auto-suspend after"><Input defaultValue="60 days" /></Row>
        </Section>
        <Section title="Security" description="Account-wide security policies">
          <Row label="Enforce MFA" hint="All staff users"><Switch defaultChecked /></Row>
          <Row label="Session timeout"><Input defaultValue="30 minutes" /></Row>
          <Row label="IP allowlist" hint="Restrict admin console"><Switch /></Row>
        </Section>
      </div>
    </>
  );
}
