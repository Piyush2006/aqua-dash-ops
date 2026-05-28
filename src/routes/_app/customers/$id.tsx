import { createFileRoute, useParams, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendArea } from "@/components/charts";
import { customers, townships, bills, payments, auditLog, customerConsumption, formatCurrency } from "@/mocks/data";
import { ArrowLeft, Phone, Mail, MapPin, FileText, Download, Droplets, Gauge, IndianRupee, Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export const Route = createFileRoute("/_app/customers/$id")({ component: CustomerDetail });

function CustomerDetail() {
  const { id } = useParams({ from: "/_app/customers/$id" });
  const c = customers.find((x) => x.id === id) ?? customers[0];
  const township = townships.find((t) => t.id === c.townshipId)!;
  const customerBills = bills.filter((b) => b.customerId === c.id).concat(bills.slice(0, 6));
  const customerPayments = payments.slice(0, 5);

  return (
    <>
      <Link to="/customers" className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" /> Back to consumers</Link>
      <PageHeader
        title={c.name}
        description={`${c.id} · ${township.name} · ${c.flat}`}
        actions={
          <>
            <StatusBadge status={c.connectionStatus} />
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-4 w-4" /> Statement</Button>
            <Button size="sm">Edit profile</Button>
          </>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList className="bg-surface">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="meter">Meter History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
              <p className="mb-4 text-sm font-semibold">Profile</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Mobile</p><p>{c.mobile}</p></div></div>
                <div className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Email</p><p>{c.email}</p></div></div>
                <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Address</p><p>{c.flat}, {township.name}, {township.city}</p></div></div>
                <div className="flex items-start gap-2"><Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Joined</p><p>{c.joinedAt}</p></div></div>
                <div className="flex items-start gap-2"><FileText className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">KYC</p><StatusBadge status={c.kyc} /></div></div>
                <div className="flex items-start gap-2"><Gauge className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Meter ID</p><p className="font-mono text-xs">{c.meterId}</p></div></div>
              </div>
            </div>

            <div className="space-y-4">
              <KpiCard variant="primary" label="Outstanding" value={formatCurrency(c.outstanding)} icon={IndianRupee} />
              <KpiCard label="This month consumption" value="28.4 KL" delta={4.2} icon={Droplets} />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-card">
            <p className="mb-3 text-sm font-semibold">Consumption summary</p>
            <TrendArea data={customerConsumption} x="month" series={[{ key: "consumption", label: "Consumption (KL)" }]} height={220} />
          </div>
        </TabsContent>

        <TabsContent value="consumption" className="mt-4">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <p className="mb-3 text-sm font-semibold">Consumption history</p>
            <TrendArea data={customerConsumption} x="month" series={[
              { key: "consumption", label: "Consumption (KL)" },
              { key: "bill", label: "Bill (₹)" },
            ]} height={320} />
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <div className="rounded-xl border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs uppercase text-muted-foreground"><tr>
                <th className="px-4 py-3">Invoice</th><th className="px-4 py-3">Period</th><th className="px-4 py-3">Consumption</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th>
              </tr></thead>
              <tbody>
                {customerBills.slice(0, 8).map((b) => (
                  <tr key={b.id} className="border-t hover:bg-surface">
                    <td className="px-4 py-2.5 font-mono text-xs">{b.id}</td>
                    <td className="px-4 py-2.5">{b.period}</td>
                    <td className="px-4 py-2.5">{b.consumption} KL</td>
                    <td className="px-4 py-2.5 font-semibold tabular-nums">{formatCurrency(b.amount)}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <div className="rounded-xl border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs uppercase text-muted-foreground"><tr>
                <th className="px-4 py-3">Payment ID</th><th className="px-4 py-3">Bill</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th>
              </tr></thead>
              <tbody>
                {customerPayments.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-surface">
                    <td className="px-4 py-2.5 font-mono text-xs">{p.id}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{p.billId}</td>
                    <td className="px-4 py-2.5">{p.method}</td>
                    <td className="px-4 py-2.5 tabular-nums">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{p.date}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="meter" className="mt-4">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <p className="mb-2 text-sm font-semibold">Meter assignment history</p>
            <div className="divide-y">
              <div className="flex items-center justify-between py-3 text-sm"><span>{c.meterId} (current)</span><span className="text-xs text-muted-foreground">since {c.joinedAt}</span></div>
              <div className="flex items-center justify-between py-3 text-sm text-muted-foreground"><span>MTR-049821</span><span className="text-xs">2022-04 → 2023-08</span></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4"><EmptyState icon={FileText} title="No documents uploaded" description="Upload KYC documents, agreements and proofs." /></TabsContent>
        <TabsContent value="notes" className="mt-4"><EmptyState icon={FileText} title="No notes yet" description="Add internal notes for this customer." /></TabsContent>

        <TabsContent value="audit" className="mt-4">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <p className="mb-3 text-sm font-semibold">Activity log</p>
            <div className="space-y-3">
              {auditLog.slice(0, 8).map((a) => (
                <div key={a.id} className="flex gap-3 text-sm">
                  <span className="w-24 shrink-0 text-xs font-mono text-muted-foreground">{a.timestamp}</span>
                  <div className="flex-1"><p className="text-foreground"><span className="font-medium">{a.actor}</span> {a.action} <span className="font-medium">{a.entity}</span> <span className="font-mono text-xs text-muted-foreground">{a.entityId}</span></p></div>
                  <StatusBadge status={a.category as any} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
