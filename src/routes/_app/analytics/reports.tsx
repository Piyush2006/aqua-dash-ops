import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/ui/kpi-card";
import { BarsChart, TrendArea, TrendLine, Donut } from "@/components/charts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { downloadPdfReport } from "@/lib/pdf-report";
import {
  revenueTrend, consumptionTrend, collectionEfficiencyTrend, townshipComparison,
  outstandingAging, meterHealth, readSuccessTrend, townships, formatCurrency, formatNumber,
} from "@/mocks/data";

export const Route = createFileRoute("/_app/analytics/reports")({ component: Page });

type ReportKey = "revenue" | "consumption" | "collections" | "water-loss" | "meters";

const REPORTS: { key: ReportKey; label: string; desc: string }[] = [
  { key: "revenue", label: "Revenue Report", desc: "Billed vs collected, township comparison" },
  { key: "consumption", label: "Consumption Report", desc: "Domestic, commercial, common-area usage" },
  { key: "collections", label: "Collections Report", desc: "Efficiency trend and outstanding aging" },
  { key: "water-loss", label: "Water Loss / NRW", desc: "Non-revenue water breakdown and trend" },
  { key: "meters", label: "Meter Report", desc: "Fleet health and read success" },
];

const lossBreakdown = [
  { name: "Physical Leakage", value: 6.4, color: "var(--color-critical)" },
  { name: "Apparent (metering)", value: 4.8, color: "var(--color-warning)" },
  { name: "Unauthorized Use", value: 2.1, color: "var(--color-accent)" },
  { name: "Authorized Unbilled", value: 1.5, color: "var(--color-muted-foreground)" },
];

function Page() {
  const [report, setReport] = useState<ReportKey>("revenue");
  const [township, setTownship] = useState<string>("all");
  const [period, setPeriod] = useState<string>("12m");
  const [format, setFormat] = useState<string>("PDF");

  const meta = useMemo(() => REPORTS.find((r) => r.key === report)!, [report]);

  return (
    <>
      <PageHeader
        title="Reports"
        description="Filter and render any operational, billing or analytics report on one screen."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success(`${meta.label} exported as ${format}`)}>
              <Download className="mr-1.5 h-4 w-4" /> Export {format}
            </Button>
            <Button size="sm" onClick={() => toast.success(`${meta.label} sent to recipients`)}>
              <FileText className="mr-1.5 h-4 w-4" /> Send now
            </Button>
          </>
        }
      />

      <div className="mb-6 rounded-xl border bg-card p-4 shadow-card">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Report</label>
            <Select value={report} onValueChange={(v) => setReport(v as ReportKey)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {REPORTS.map((r) => (
                  <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Township</label>
            <Select value={township} onValueChange={setTownship}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All townships</SelectItem>
                {townships.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Period</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last month</SelectItem>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="12m">Last 12 months</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="XLSX">XLSX</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{meta.label}</h2>
          <p className="text-xs text-muted-foreground">{meta.desc} · {township === "all" ? "All townships" : townships.find((t) => t.id === township)?.name} · {period.toUpperCase()}</p>
        </div>
      </div>

      {report === "revenue" && <RevenueReport />}
      {report === "consumption" && <ConsumptionReport />}
      {report === "collections" && <CollectionsReport />}
      {report === "water-loss" && <WaterLossReport />}
      {report === "meters" && <MetersReport />}
    </>
  );
}

function RevenueReport() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard variant="primary" label="Total Billed" value={formatCurrency(48_72_30_000)} delta={12.4} />
        <KpiCard variant="success" label="Collected" value={formatCurrency(46_08_42_000)} delta={9.8} />
        <KpiCard label="Outstanding" value={formatCurrency(3_84_12_500)} delta={-5.6} />
        <KpiCard label="Avg Bill (₹)" value={formatNumber(2_894)} delta={3.1} />
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <h3 className="mb-3 text-sm font-semibold">Billed vs Collected</h3>
        <TrendArea data={revenueTrend} x="month" series={[
          { key: "revenue", label: "Billed (₹ Cr)" },
          { key: "collected", label: "Collected (₹ Cr)" },
        ]} height={280} />
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <h3 className="mb-3 text-sm font-semibold">Township Comparison</h3>
        <BarsChart data={townshipComparison} x="name" series={[
          { key: "revenue", label: "Revenue (₹ L)" },
          { key: "consumption", label: "Consumption (KL)" },
        ]} height={280} />
      </div>
    </div>
  );
}

function ConsumptionReport() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard variant="accent" label="Total Consumption" value={formatNumber(28_45_120) + " KL"} delta={4.2} />
        <KpiCard label="Domestic" value="72%" delta={0.4} />
        <KpiCard label="Commercial" value="22%" delta={1.1} />
        <KpiCard label="Common Area" value="6%" delta={-0.3} />
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-card">
        <h3 className="mb-3 text-sm font-semibold">Consumption Trend</h3>
        <BarsChart data={consumptionTrend} x="month" stacked series={[
          { key: "domestic", label: "Domestic (KL)" },
          { key: "commercial", label: "Commercial (KL)" },
          { key: "common", label: "Common (KL)" },
        ]} height={300} />
      </div>
    </div>
  );
}

function CollectionsReport() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard variant="success" label="Collection Efficiency" value="94.6%" delta={1.8} />
        <KpiCard label="Outstanding" value={formatCurrency(3_84_12_500)} delta={-5.6} />
        <KpiCard label="Receipts (mo)" value={formatNumber(14_528)} delta={6.4} />
        <KpiCard label="Avg DSO" value="18 days" delta={-2.1} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Efficiency Trend</h3>
          <TrendLine data={collectionEfficiencyTrend} x="month" series={[{ key: "efficiency", label: "Efficiency %" }]} height={260} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Outstanding Aging</h3>
          <BarsChart data={outstandingAging} x="bucket" series={[{ key: "amount", label: "₹ L" }]} height={260} />
        </div>
      </div>
    </div>
  );
}

function WaterLossReport() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard variant="primary" label="NRW %" value="14.8%" delta={-2.3} />
        <KpiCard label="Physical Loss" value="6.4%" delta={-1.1} />
        <KpiCard label="Apparent Loss" value="4.8%" delta={-0.6} />
        <KpiCard label="Loss Cost (est.)" value="₹62.4 L" delta={-8.4} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Loss Breakdown</h3>
          <Donut data={lossBreakdown} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">NRW Trend</h3>
          <TrendLine data={collectionEfficiencyTrend.map((d) => ({ ...d, nrw: 22 - d.efficiency * 0.1 }))} x="month" series={[{ key: "nrw", label: "NRW %", color: "var(--color-critical)" }]} height={260} />
        </div>
      </div>
    </div>
  );
}

function MetersReport() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Active Meters" value="18,204" delta={1.4} />
        <KpiCard variant="primary" label="Read Success" value="97.8%" delta={0.6} />
        <KpiCard label="Faulty" value="287" delta={-8.1} />
        <KpiCard label="Avg Battery" value="78%" delta={-1.2} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold">Fleet Health</h3>
          <Donut data={meterHealth} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold">Read Success Trend</h3>
          <TrendArea data={readSuccessTrend} x="day" series={[{ key: "success", label: "Success", color: "var(--color-success)" }]} height={260} />
        </div>
      </div>
    </div>
  );
}
