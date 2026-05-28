import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Droplets, ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const nav = useNavigate();
  const [role, setRole] = useState("Super Admin");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden flex-col justify-between gradient-primary p-10 text-primary-foreground lg:flex">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 10%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "32px 32px, 48px 48px",
        }} />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold">AquaOps</p>
            <p className="text-xs text-white/70">Smart Utility Operations</p>
          </div>
        </div>

        <div className="relative space-y-8">
          <div>
            <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">Operate every drop with precision.</h2>
            <p className="mt-3 max-w-md text-sm text-white/75">A unified platform for water utility companies to monitor meters, generate bills, manage tariffs, and report on the health of every connection — in real time.</p>
          </div>

          <div className="grid max-w-md gap-3">
            {[
              { icon: BarChart3, title: "Executive dashboards", body: "Revenue, consumption, NRW and collection analytics at a glance." },
              { icon: Zap, title: "Real-time MDM", body: "Live meter status, exceptions and read-success monitoring." },
              { icon: ShieldCheck, title: "Enterprise-grade RBAC", body: "Multi-tenant, multi-township, audit-ready operations." },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15"><f.icon className="h-4 w-4" /></div>
                <div className="text-sm">
                  <p className="font-medium">{f.title}</p>
                  <p className="mt-0.5 text-white/70">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid max-w-md grid-cols-3 gap-3 text-xs text-white/80">
          <div><p className="text-lg font-semibold text-white">3.4M+</p><p>Reads / day</p></div>
          <div><p className="text-lg font-semibold text-white">99.97%</p><p>Uptime</p></div>
          <div><p className="text-lg font-semibold text-white">SOC 2</p><p>Type II</p></div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-primary-foreground"><Droplets className="h-5 w-5" /></div>
            <p className="text-lg font-semibold">AquaOps</p>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Sign in to your workspace</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Enter your credentials to access the operations console.</p>

          <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/dashboard" }); }} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" defaultValue="arjun@aquaops.io" className="h-11" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" type="password" defaultValue="••••••••••" className="h-11" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Continue as</Label>
              <div className="grid grid-cols-3 gap-1.5">
                {["Super Admin", "Billing Operator", "Meter Operator"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-md border px-2 py-2 text-[11px] font-medium transition-colors ${role === r ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-surface"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" defaultChecked />
              <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">Keep me signed in for 30 days</Label>
            </div>

            <Button type="submit" className="h-11 w-full gap-1.5">
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="text-center text-xs text-muted-foreground">Protected by enterprise SSO · SAML · OIDC</p>
          </form>
        </div>
      </div>
    </div>
  );
}
