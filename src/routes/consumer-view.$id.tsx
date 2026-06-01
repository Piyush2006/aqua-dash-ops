import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Droplets, IndianRupee, Calendar, Gauge, Bell, MapPin, Phone, Mail,
  Hash, FileText, Download, Eye, Plus, Activity, TrendingUp, MessageSquare, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { TrendArea, BarsChart } from "@/components/charts";
import {
  customers, townships, formatCurrency, customerAvatar, customerInitials,
} from "@/mocks/data";
import { downloadPdfReport } from "@/lib/pdf-report";
import { toast } from "sonner";

export const Route = createFileRoute("/consumer-view/$id")({ component: ConsumerView });

function ConsumerView() {
  const { id } = useParams({ from: "/consumer-view/$id" });
  const c = customers.find((x) => x.id === id) ?? customers[0];
  const township = townships.find((t) => t.id === c.townshipId)!;

  // Derive consumer-side data deterministically from the customer record
  const data = useMemo(() => deriveConsumerData(c.id, c.tariff), [c.id, c.tariff]);
  const [requests, setRequests] = useState(data.requests);
  const [notifs, setNotifs] = useState(data.notifications);

  const currentBill = data.bills[0];
  const prevKL = data.consumption[data.consumption.length - 2].consumption;
  const curKL = data.consumption[data.consumption.length - 1].consumption;
  const avgKL = +(data.consumption.reduce((a, b) => a + b.consumption, 0) / data.consumption.length).toFixed(1);
  const delta = +(((curKL - prevKL) / prevKL) * 100).toFixed(1);

  const openReq = requests.filter((r) => r.status === "Open").length;
  const inProgReq = requests.filter((r) => r.status === "In Progress").length;
  const resolvedReq = requests.filter((r) => r.status === "Resolved" || r.status === "Closed").length;
  const unreadNotif = notifs.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top bar: switch back to utility view */}
      <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">AquaOps · Consumer View</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Customer self-service experience</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/customers/$id" params={{ id: c.id }}>
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to utility view
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Consumer hero */}
        <section className="overflow-hidden rounded-2xl border bg-card shadow-card">
          {/* Decorative gradient band */}
          <div className="relative h-28 gradient-primary">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_60%)]" />
          </div>

          {/* Avatar + content */}
          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <Avatar className="h-24 w-24 ring-4 ring-card shadow-card">
                  <AvatarImage src={customerAvatar(c.id)} alt={c.name} />
                  <AvatarFallback className="text-lg">{customerInitials(c.name)}</AvatarFallback>
                </Avatar>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">{c.name}</h1>
                    <StatusBadge status={effectiveStatus} dot />
                  </div>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {c.flat}, {township.name}, {township.city}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => toast.success("Redirecting to payment gateway…")}>
                  <IndianRupee className="mr-1.5 h-4 w-4" /> Pay bill
                </Button>
                <Button size="sm" variant="outline" onClick={() => downloadBill(currentBill, c.name)}>
                  <Download className="mr-1.5 h-4 w-4" /> Bill PDF
                </Button>
              </div>
            </div>

            {/* Meta grid */}
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-t pt-4 sm:grid-cols-4">
              <MetaItem label="Consumer ID" value={c.id} />
              <MetaItem label="Connection No" value={`CN-${c.id.replace("CUS-", "")}`} />
              <MetaItem label="Consumer Type" value={c.tariff.startsWith("Commercial") ? "Commercial" : "Residential"} />
              <MetaItem label="Meter ID" value={c.meterId} />
            </dl>
          </div>
        </section>


        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            tone={currentBill.status === "Overdue" ? "warning" : "primary"}
            icon={IndianRupee}
            label="Current bill"
            value={formatCurrency(currentBill.amount)}
            lines={[`Due ${currentBill.dueDate}`, `Status: ${currentBill.status}`]}
          />
          <SummaryCard
            icon={Droplets}
            label="Consumption"
            value={`${curKL} KL`}
            lines={[`Prev ${prevKL} KL`, `Avg ${avgKL} KL · ${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta)}%`]}
          />
          <SummaryCard
            icon={MessageSquare}
            label="Service requests"
            value={`${requests.length}`}
            lines={[`${openReq} open · ${inProgReq} in progress`, `${resolvedReq} resolved`]}
          />
          <SummaryCard
            icon={Bell}
            label="Notifications"
            value={`${notifs.length}`}
            lines={[`${unreadNotif} unread`, "Last 30 days"]}
          />
        </section>

        {/* Widgets */}
        <Tabs defaultValue="overview">
          <TabsList className="bg-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Widget className="lg:col-span-2" title="Consumption trend" subtitle="Monthly usage (KL)">
              <TrendArea data={data.consumption} x="month" series={[{ key: "consumption", label: "Consumption (KL)" }]} height={240} />
            </Widget>
            <Widget title="Activity feed" subtitle="Recent updates on your account">
              <ul className="space-y-3 text-sm">
                {notifs.slice(0, 6).map((n) => (
                  <li key={n.id} className="flex gap-3">
                    <ActivityDot type={n.type} />
                    <div className="min-w-0">
                      <p className="text-foreground"><span className="font-medium">{n.title}</span></p>
                      <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{n.type} · {n.at}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Widget>
          </TabsContent>

          {/* CONSUMPTION */}
          <TabsContent value="consumption" className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Widget title="Monthly consumption" subtitle="Last 12 months (KL)">
              <TrendArea data={data.consumption} x="month" series={[{ key: "consumption", label: "Consumption (KL)" }]} height={240} />
            </Widget>
            <Widget title="Daily usage" subtitle="Last 30 days (KL)">
              <BarsChart data={data.daily} x="day" series={[{ key: "kl", label: "KL" }]} height={240} />
            </Widget>
            <Widget className="lg:col-span-2" title="Meter reading history" subtitle="Recent reads from your meter">
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Reading (L)</th>
                      <th className="px-3 py-2">Consumption (KL)</th>
                      <th className="px-3 py-2">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.readings.map((r) => (
                      <tr key={r.date} className="border-t">
                        <td className="px-3 py-2 font-medium">{r.date}</td>
                        <td className="px-3 py-2 tabular-nums">{r.reading.toLocaleString("en-IN")}</td>
                        <td className="px-3 py-2 tabular-nums">{r.consumption}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">{r.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Widget>
          </TabsContent>

          {/* BILLS */}
          <TabsContent value="bills" className="mt-4 space-y-4">
            <Widget title="Current bill" subtitle={`${currentBill.period} · Due ${currentBill.dueDate}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold tabular-nums">{formatCurrency(currentBill.amount)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Consumption: {currentBill.consumption} KL · Tariff: {c.tariff}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => toast.success("Redirecting to payment gateway…")}><IndianRupee className="mr-1.5 h-4 w-4" /> Pay {formatCurrency(currentBill.amount)}</Button>
                  <Button variant="outline" onClick={() => downloadBill(currentBill, c.name)}><Download className="mr-1.5 h-4 w-4" /> Download</Button>
                </div>
              </div>
            </Widget>

            <Widget title="Bill history" subtitle="Last 10 bills">
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">Invoice</th>
                      <th className="px-3 py-2">Period</th>
                      <th className="px-3 py-2">Consumption</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bills.map((b) => (
                      <tr key={b.id} className="border-t">
                        <td className="px-3 py-2 font-mono text-xs">{b.id}</td>
                        <td className="px-3 py-2">{b.period}</td>
                        <td className="px-3 py-2 tabular-nums">{b.consumption} KL</td>
                        <td className="px-3 py-2 font-semibold tabular-nums">{formatCurrency(b.amount)}</td>
                        <td className="px-3 py-2"><StatusBadge status={b.status} /></td>
                        <td className="px-3 py-2 text-right">
                          <Button size="sm" variant="ghost" className="h-7" onClick={() => downloadBill(b, c.name)}>
                            <Download className="mr-1 h-3 w-3" /> PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Widget>
          </TabsContent>

          {/* REQUESTS */}
          <TabsContent value="requests" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <NewRequestDialog onCreate={(req) => { setRequests([req, ...requests]); toast.success("Request submitted"); }} />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {requests.map((r) => (
                <Widget key={r.id} title={r.subject} subtitle={`${r.id} · ${r.category} · ${r.raisedAt}`} action={<StatusBadge status={r.status} />}>
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                  {r.updates.length > 0 && (
                    <ol className="mt-3 space-y-2 border-l pl-3 text-xs">
                      {r.updates.map((u, i) => (
                        <li key={i} className="relative">
                          <span className="absolute -left-[15px] top-1 h-2 w-2 rounded-full bg-primary" />
                          <p className="text-foreground">{u.note}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{u.at}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </Widget>
              ))}
            </div>
          </TabsContent>

          {/* PROFILE */}
          <TabsContent value="profile" className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Widget title="Personal information">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16"><AvatarImage src={customerAvatar(c.id)} /><AvatarFallback>{customerInitials(c.name)}</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.id} · Joined {c.joinedAt}</p>
                  <p className="text-xs text-muted-foreground">Occupancy: {c.occupancy} · KYC: {c.kyc}</p>
                </div>
              </div>
            </Widget>
            <Widget title="Contact information">
              <ProfileRow icon={Phone} label="Mobile" value={c.mobile} />
              <ProfileRow icon={Mail} label="Email" value={c.email} />
            </Widget>
            <Widget title="Service address">
              <ProfileRow icon={MapPin} label="Address" value={`${c.flat}, ${township.name}, ${township.city}`} />
              <ProfileRow icon={Hash} label="Flat / Block" value={`${c.flat} · Block ${c.block} · Floor ${c.floor}`} />
            </Widget>
            <Widget title="Connection information">
              <ProfileRow icon={Hash} label="Connection No" value={`CN-${c.id.replace("CUS-", "")}`} />
              <ProfileRow icon={Gauge} label="Meter ID" value={c.meterId} />
              <ProfileRow icon={FileText} label="Tariff" value={c.tariff} />
              <ProfileRow icon={Calendar} label="Status" value={<StatusBadge status={c.connectionStatus} dot />} />
            </Widget>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function SummaryCard({ icon: Icon, label, value, lines, tone = "default" }: { icon: any; label: string; value: string; lines: string[]; tone?: "default" | "primary" | "warning" }) {
  const toneCls = tone === "primary" ? "border-primary/40 bg-primary/5" : tone === "warning" ? "border-warning/40 bg-warning-soft" : "bg-card";
  return (
    <div className={`rounded-xl border p-5 shadow-card ${toneCls}`}>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
        {lines.map((l, i) => <p key={i}>{l}</p>)}
      </div>
    </div>
  );
}

function Widget({ title, subtitle, action, children, className = "" }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border bg-card p-5 shadow-card ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ProfileRow({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 border-t py-2.5 text-sm first:border-t-0 first:pt-0">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="truncate text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}

function ActivityDot({ type }: { type: string }) {
  const map: Record<string, { cls: string; Icon: any }> = {
    Bill: { cls: "bg-primary/15 text-primary", Icon: IndianRupee },
    Reminder: { cls: "bg-warning-soft text-warning", Icon: Calendar },
    Service: { cls: "bg-info-soft text-info", Icon: MessageSquare },
    Reading: { cls: "bg-success-soft text-success", Icon: Activity },
    Alert: { cls: "bg-critical-soft text-critical", Icon: TrendingUp },
  };
  const { cls, Icon } = map[type] ?? map.Bill;
  return <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${cls}`}><Icon className="h-3.5 w-3.5" /></span>;
}

function NewRequestDialog({ onCreate }: { onCreate: (r: any) => void }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("Billing Issue");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const submit = () => {
    if (!subject.trim()) return toast.error("Please add a subject");
    onCreate({
      id: `SR-${Date.now().toString().slice(-7)}`,
      category, subject, description,
      raisedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Open",
      updates: [{ at: "Just now", note: "Request received" }],
    });
    setOpen(false); setSubject(""); setDescription("");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> New request</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Raise a service request</DialogTitle>
          <DialogDescription>Our team will respond within 24 hours.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Billing Issue", "Meter Issue", "Water Supply Issue", "General Inquiry"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary" /></div>
          <div><Label>Description</Label><Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us more…" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- mock derivation ---------------- */

function deriveConsumerData(id: string, tariff: string) {
  const seed = parseInt(id.replace(/\D/g, "")) || 1;
  const months = ["Dec 24", "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25", "Sep 25", "Oct 25", "Nov 25"];
  const consumption = months.map((m, i) => {
    const seasonal = 22 + Math.sin((i / 12) * Math.PI * 2 + seed) * 6;
    const val = +(seasonal + ((seed + i) % 5)).toFixed(1);
    return { month: m, consumption: val, bill: Math.round(val * 82) };
  });
  const daily = Array.from({ length: 30 }, (_, i) => ({
    day: `${i + 1}`,
    kl: +(0.7 + Math.abs(Math.sin(i * 0.6 + seed * 0.1)) * 0.7 + (i % 7 === 0 ? 0.3 : 0)).toFixed(2),
  }));
  const readings = consumption.map((c, i) => ({
    date: `${String((i % 28) + 1).padStart(2, "0")} ${c.month}`,
    reading: 18420 + i * 28 + (seed % 50),
    consumption: c.consumption,
    type: i % 4 === 0 ? "Manual" : "Auto",
  })).slice(-8).reverse();
  const bills = consumption.slice(-10).reverse().map((c, i) => {
    const taxes = Math.round(c.bill * 0.18);
    const status: "Sent" | "Paid" | "Overdue" = i === 0 ? "Sent" : i === 1 && seed % 3 === 0 ? "Overdue" : "Paid";
    return {
      id: `INV-2025${String(110 - i).padStart(4, "0")}`,
      period: c.month,
      billDate: `01 ${c.month}`,
      dueDate: `15 ${c.month}`,
      consumption: c.consumption,
      amount: c.bill + taxes,
      base: c.bill,
      taxes,
      status,
      tariff,
    };
  });
  const requests = [
    { id: "SR-2025-00481", category: "Billing Issue", subject: "Discrepancy in October bill", description: "Bill amount seems higher than usual.", raisedAt: "12 Nov 2025", status: "In Progress" as const, updates: [
      { at: "12 Nov", note: "Request received and assigned to billing team" },
      { at: "14 Nov", note: "Meter reading re-verified, awaiting tariff review" },
    ] },
    { id: "SR-2025-00422", category: "Meter Issue", subject: "Low battery indicator on meter", description: "Display blinks intermittently.", raisedAt: "28 Oct 2025", status: "Resolved" as const, updates: [
      { at: "28 Oct", note: "Field visit scheduled" }, { at: "31 Oct", note: "Battery replaced" },
    ] },
    { id: "SR-2025-00388", category: "Water Supply Issue", subject: "Low pressure in morning", description: "Pressure drops 6-8 AM.", raisedAt: "14 Oct 2025", status: "Closed" as const, updates: [{ at: "20 Oct", note: "Booster pump recalibrated" }] },
    { id: "SR-2025-00255", category: "General Inquiry", subject: "Tariff slab clarification", description: "Request for slab-wise tariff rates.", raisedAt: "02 Oct 2025", status: "Open" as const, updates: [{ at: "02 Oct", note: "Logged" }] },
  ];
  const notifications = [
    { id: "N-1", type: "Bill", title: "New bill generated", body: `Your November bill of ${formatCurrency(bills[0].amount)} is ready.`, at: "2h ago", read: false },
    { id: "N-2", type: "Alert", title: "High consumption alert", body: "Yesterday usage 38% above your daily average.", at: "1d ago", read: false },
    { id: "N-3", type: "Service", title: "Service request update", body: "SR-2025-00481 moved to In Progress.", at: "2d ago", read: false },
    { id: "N-4", type: "Reminder", title: "Bill due reminder", body: `${formatCurrency(bills[0].amount)} due on ${bills[0].dueDate}.`, at: "3d ago", read: true },
    { id: "N-5", type: "Reading", title: "Meter reading reminder", body: "Auto reading scheduled for tomorrow 09:00.", at: "5d ago", read: true },
    { id: "N-6", type: "Bill", title: "Payment received", body: `Thank you. Payment of ${formatCurrency(bills[2].amount)} confirmed.`, at: "1w ago", read: true },
  ];
  return { consumption, daily, readings, bills, requests, notifications };
}

function downloadBill(bill: any, customerName: string) {
  downloadPdfReport({
    title: `Water Bill ${bill.period}`,
    subtitle: `Invoice ${bill.id}`,
    meta: {
      "Consumer": customerName,
      "Period": bill.period,
      "Bill Date": bill.billDate,
      "Due Date": bill.dueDate,
      "Status": bill.status,
    },
    sections: [
      {
        heading: "Charges",
        table: {
          head: ["Description", "Amount (₹)"],
          body: [
            ["Water charges (base)", String(bill.base)],
            ["GST @ 18%", String(bill.taxes)],
            ["Consumption", `${bill.consumption} KL`],
            ["Total Payable", String(bill.amount)],
          ],
        },
      },
    ],
    filename: `${bill.id}.pdf`,
  });
}
