import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Paperclip, MessageSquare } from "lucide-react";
import { portalRequests, type PortalRequest } from "@/mocks/portal";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/portal/requests")({ component: RequestsPage });

const categories: PortalRequest["category"][] = [
  "Billing Issue", "Meter Issue", "Connection Issue", "Water Supply Issue", "General Inquiry",
];

const statusFilters = ["All", "Open", "In Progress", "Resolved", "Closed"] as const;

function RequestsPage() {
  const [list, setList] = useState(portalRequests);
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>("All");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: categories[0] as string, subject: "", description: "" });
  const [detail, setDetail] = useState<PortalRequest | null>(null);

  const submit = () => {
    if (!form.subject.trim() || !form.description.trim()) {
      toast.error("Please fill subject and description");
      return;
    }
    const id = `SR-2025-${String(500 + list.length).padStart(5, "0")}`;
    const req: PortalRequest = {
      id,
      category: form.category as PortalRequest["category"],
      subject: form.subject,
      description: form.description,
      raisedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Open",
      updates: [{ at: "Just now", note: "Request submitted, awaiting triage" }],
    };
    setList([req, ...list]);
    setOpen(false);
    setForm({ category: categories[0], subject: "", description: "" });
    toast.success(`Request ${id} raised`);
  };

  const filtered = filter === "All" ? list : list.filter((r) => r.status === filter);

  return (
    <>
      <PageHeader
        title="Service Requests"
        description="Raise and track requests with your utility"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New request</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Raise a service request</DialogTitle>
                <DialogDescription>Our team typically responds within 24 hours</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input className="mt-1.5" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief title" maxLength={120} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea className="mt-1.5" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your issue in detail" maxLength={1000} />
                </div>
                <div>
                  <Label>Attachment</Label>
                  <Button type="button" variant="outline" className="mt-1.5 w-full justify-start" onClick={() => toast.info("File picker (demo)")}>
                    <Paperclip className="mr-1.5 h-4 w-4" /> Attach file (optional)
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={submit}>Submit request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {statusFilters.map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="h-7 text-xs">
            {s} {s !== "All" && <span className="ml-1.5 rounded-md bg-background/40 px-1.5 text-[10px]">{list.filter((r) => r.status === s).length}</span>}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <button
            key={r.id}
            onClick={() => setDetail(r)}
            className="block w-full rounded-xl border bg-card p-4 text-left shadow-card transition-shadow hover:shadow-elevated"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{r.category}</span>
                </div>
                <p className="mt-1.5 font-semibold text-foreground">{r.subject}</p>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{r.description}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={r.status} dot />
                <p className="mt-1.5 text-xs text-muted-foreground">{r.raisedAt}</p>
              </div>
            </div>
          </button>
        ))}
        {!filtered.length && (
          <div className="rounded-xl border border-dashed bg-muted/20 p-12 text-center text-sm text-muted-foreground">No requests in this status</div>
        )}
      </div>

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent>
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>{detail.subject}</DialogTitle>
                <DialogDescription>{detail.id} · {detail.category} · {detail.raisedAt}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="rounded-lg border bg-muted/30 p-3 text-sm">{detail.description}</div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" /> Updates
                  </p>
                  <div className="space-y-2">
                    {detail.updates.map((u, i) => (
                      <div key={i} className="rounded-md border-l-2 border-primary bg-muted/20 px-3 py-2">
                        <p className="text-xs text-muted-foreground">{u.at}</p>
                        <p className="text-sm">{u.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/30 p-2.5">
                  <span className="text-xs text-muted-foreground">Current status</span>
                  <StatusBadge status={detail.status} dot />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
