import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPasswordPage });

function ForgotPasswordPage() {
  const nav = useNavigate();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between gradient-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur"><Droplets className="h-5 w-5" /></div>
          <div><p className="text-base font-semibold">AquaOps</p><p className="text-xs text-white/70">Smart Utility Operations</p></div>
        </div>
        <div>
          <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">Reset access in seconds.</h2>
          <p className="mt-3 max-w-md text-sm text-white/75">We'll send a secure reset link to your work email. Links expire in 15 minutes.</p>
        </div>
        <div />
      </div>
      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Back to sign in</Link>
          <h1 className="text-2xl font-semibold tracking-tight">Forgot your password?</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Enter the email associated with your account and we'll send you a reset link.</p>
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Reset link sent to your inbox"); setTimeout(() => nav({ to: "/login" }), 800); }} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" placeholder="you@company.com" className="h-11" required />
            </div>
            <Button type="submit" className="h-11 w-full">Send reset link</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
