import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionHeader } from "@/components/ui/page-header";
import { KpiCard } from "@/components/ui/kpi-card";
import { TrendArea, BarsChart, TrendLine } from "@/components/charts";
import { DataTable, Column } from "@/components/ui/data-table";
import { Droplets, Activity, TrendingUp, Gauge } from "lucide-react";
import {
  consumptionHistory, dailyConsumption, meterReadings,
  currentMonthKL, averageKL, peakKL, previousMonthKL,
} from "@/mocks/portal";

export const Route = createFileRoute("/_app/portal/consumption")({ component: ConsumptionPage });

type Reading = (typeof meterReadings)[number];

function ConsumptionPage() {
  const delta = +(((currentMonthKL - previousMonthKL) / previousMonthKL) * 100).toFixed(1);
  const cols: Column<Reading>[] = [
    { key: "date", header: "Date", accessor: (r) => <span className="font-medium">{r.date}</span> },
    { key: "reading", header: "Reading (L)", accessor: (r) => <span className="tabular-nums">{r.reading.toLocaleString("en-IN")}</span>, sortValue: (r) => r.reading },
    { key: "consumption", header: "Consumption (KL)", accessor: (r) => <span className="tabular-nums">{r.consumption}</span>, sortValue: (r) => r.consumption },
    { key: "type", header: "Source", accessor: (r) => <span className="text-xs text-muted-foreground">{r.type}</span> },
  ];

  return (
    <>
      <PageHeader title="My Consumption" description="Track your usage patterns and history" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard variant="primary" label="Current month" value={`${currentMonthKL} KL`} delta={delta} icon={Droplets} />
        <KpiCard label="Average usage" value={`${averageKL} KL`} icon={Activity} sub="12-month average" />
        <KpiCard label="Peak usage" value={`${peakKL} KL`} icon={TrendingUp} sub="Highest in last 12 months" />
        <KpiCard label="Last reading" value={`${meterReadings[meterReadings.length - 1].reading.toLocaleString("en-IN")} L`} icon={Gauge} sub={meterReadings[meterReadings.length - 1].date} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <SectionHeader title="Monthly consumption" description="vs your 12-month average" />
          <TrendArea data={consumptionHistory} x="month" series={[
            { key: "consumption", label: "Consumption (KL)" },
            { key: "avg", label: "Average" },
          ]} height={260} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <SectionHeader title="Daily consumption (last 30 days)" description="In KL per day" />
          <BarsChart data={dailyConsumption} x="day" series={[{ key: "kl", label: "KL" }]} height={260} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5 shadow-card">
        <SectionHeader title="Bill amount trend" description="Last 12 months" />
        <TrendLine data={consumptionHistory} x="month" series={[{ key: "bill", label: "Bill (₹)" }]} height={220} />
      </div>

      <div className="mt-6">
        <SectionHeader title="Meter reading history" description="Recent reads from your meter" />
        <DataTable data={meterReadings} columns={cols} rowKey={(r) => r.date} searchKeys={["date", "type"]} />
      </div>
    </>
  );
}
