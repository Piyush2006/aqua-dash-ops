import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";

type Variant = "default" | "primary" | "accent" | "success" | "warning" | "critical";

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: LucideIcon;
  variant?: Variant;
  sub?: string;
  className?: string;
}

const gradientMap: Record<Variant, string> = {
  default: "",
  primary: "gradient-primary text-primary-foreground",
  accent: "gradient-accent text-primary-foreground",
  success: "gradient-success text-primary-foreground",
  warning: "gradient-warning text-primary-foreground",
  critical: "gradient-critical text-primary-foreground",
};

export function KpiCard({ label, value, delta, deltaLabel = "vs last month", icon: Icon, variant = "default", sub, className }: KpiCardProps) {
  const isGradient = variant !== "default";
  const positive = (delta ?? 0) >= 0;
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border p-5 shadow-card transition-shadow hover:shadow-elevated",
      isGradient ? gradientMap[variant] + " border-transparent" : "bg-card",
      className,
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={cn("text-xs font-medium uppercase tracking-wider", isGradient ? "text-white/80" : "text-muted-foreground")}>{label}</p>
          <p className={cn("kpi-number mt-2 text-3xl font-semibold", isGradient ? "text-white" : "text-foreground")}>{value}</p>
          {sub && <p className={cn("mt-1 text-xs", isGradient ? "text-white/70" : "text-muted-foreground")}>{sub}</p>}
        </div>
        {Icon && (
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            isGradient ? "bg-white/15 text-white" : "bg-primary/10 text-primary",
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {typeof delta === "number" && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span className={cn(
            "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
            isGradient ? "bg-white/15 text-white" : positive ? "bg-success-soft text-success" : "bg-critical-soft text-critical",
          )}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className={cn(isGradient ? "text-white/70" : "text-muted-foreground")}>{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}
