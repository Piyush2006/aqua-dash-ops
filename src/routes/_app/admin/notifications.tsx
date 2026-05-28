import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Mail, MessageSquare, Smartphone, Bell } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin/notifications")({ component: Page });

const channels = [
  { key: "email", label: "Email", icon: Mail, default: true },
  { key: "sms", label: "SMS", icon: MessageSquare, default: true },
  { key: "push", label: "Push (Mobile)", icon: Smartphone, default: false },
  { key: "inapp", label: "In-app", icon: Bell, default: true },
];

const events = [
  "Bill generated", "Payment received", "Payment overdue", "Meter offline",
  "Leakage detected", "Reverse flow", "Tariff approval needed",
  "Reading cycle completed", "Critical alert raised", "Service request raised",
];

function Page() {
  const [state, setState] = useState(() => {
    const init: Record<string, Record<string, boolean>> = {};
    events.forEach((e) => {
      init[e] = {};
      channels.forEach((c) => (init[e][c.key] = c.default));
    });
    return init;
  });

  return (
    <>
      <PageHeader title="Notifications" description="Channel routing for each event class" actions={
        <Button size="sm" onClick={() => toast.success("Preferences saved")}>Save changes</Button>
      } />
      <div className="rounded-xl border bg-card shadow-card">
        <div className="grid grid-cols-[1fr_repeat(4,100px)] items-center border-b px-5 py-3 text-xs font-medium text-muted-foreground">
          <span>Event</span>
          {channels.map((c) => (
            <span key={c.key} className="flex items-center justify-center gap-1.5"><c.icon className="h-3.5 w-3.5" /> {c.label}</span>
          ))}
        </div>
        {events.map((e) => (
          <div key={e} className="grid grid-cols-[1fr_repeat(4,100px)] items-center border-b px-5 py-3 last:border-0">
            <span className="text-sm font-medium">{e}</span>
            {channels.map((c) => (
              <div key={c.key} className="flex justify-center">
                <Switch checked={state[e][c.key]} onCheckedChange={(v) => setState((s) => ({ ...s, [e]: { ...s[e], [c.key]: v } }))} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
