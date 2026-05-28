import { cn } from "@/lib/utils";

type Status = string;

const map: Record<string, string> = {
  Active: "bg-success-soft text-success ring-success/20",
  Paid: "bg-success-soft text-success ring-success/20",
  Success: "bg-success-soft text-success ring-success/20",
  Verified: "bg-success-soft text-success ring-success/20",
  Approved: "bg-success-soft text-success ring-success/20",
  Resolved: "bg-success-soft text-success ring-success/20",
  Generated: "bg-info-soft text-info ring-info/20",
  Sent: "bg-info-soft text-info ring-info/20",
  Validated: "bg-info-soft text-info ring-info/20",
  Pending: "bg-warning-soft text-warning-foreground ring-warning/30",
  "Pending Approval": "bg-warning-soft text-warning-foreground ring-warning/30",
  "Low Battery": "bg-warning-soft text-warning-foreground ring-warning/30",
  Acknowledged: "bg-warning-soft text-warning-foreground ring-warning/30",
  "In Progress": "bg-info-soft text-info ring-info/20",
  Draft: "bg-muted text-muted-foreground ring-border",
  Archived: "bg-muted text-muted-foreground ring-border",
  Inactive: "bg-muted text-muted-foreground ring-border",
  Vacant: "bg-muted text-muted-foreground ring-border",
  Offline: "bg-muted text-muted-foreground ring-border",
  Open: "bg-critical-soft text-critical ring-critical/20",
  Critical: "bg-critical-soft text-critical ring-critical/20",
  Faulty: "bg-critical-soft text-critical ring-critical/20",
  Failed: "bg-critical-soft text-critical ring-critical/20",
  Rejected: "bg-critical-soft text-critical ring-critical/20",
  Overdue: "bg-critical-soft text-critical ring-critical/20",
  Suspended: "bg-critical-soft text-critical ring-critical/20",
  High: "bg-warning-soft text-warning-foreground ring-warning/30",
  Medium: "bg-info-soft text-info ring-info/20",
  Low: "bg-muted text-muted-foreground ring-border",
};

const dotMap: Record<string, string> = {
  Active: "bg-success",
  Paid: "bg-success",
  Success: "bg-success",
  Verified: "bg-success",
  Approved: "bg-success",
  Resolved: "bg-success",
  Generated: "bg-info",
  Sent: "bg-info",
  Pending: "bg-warning",
  "Low Battery": "bg-warning",
  Acknowledged: "bg-warning",
  Open: "bg-critical",
  Critical: "bg-critical",
  Faulty: "bg-critical",
  Failed: "bg-critical",
  Overdue: "bg-critical",
  Offline: "bg-muted-foreground",
};

export function StatusBadge({ status, dot = false, className }: { status: Status; dot?: boolean; className?: string }) {
  const cls = map[status] ?? "bg-muted text-muted-foreground ring-border";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset", cls, className)}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotMap[status] ?? "bg-muted-foreground")} />}
      {status}
    </span>
  );
}
