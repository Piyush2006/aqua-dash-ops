// Seeded mock data — deterministic across reloads
let seed = 42;
const rand = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};
const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

export const tenants = [
  { id: "t-prestige", name: "Prestige Group" },
  { id: "t-sobha", name: "Sobha Developers" },
  { id: "t-dlf", name: "DLF Limited" },
];

export const townships = [
  { id: "tw-1", name: "Prestige Lakeside Habitat", tenantId: "t-prestige", flats: 3400, city: "Bengaluru" },
  { id: "tw-2", name: "Sobha Dream Acres", tenantId: "t-sobha", flats: 5800, city: "Bengaluru" },
  { id: "tw-3", name: "DLF Phase 5", tenantId: "t-dlf", flats: 2100, city: "Gurugram" },
  { id: "tw-4", name: "Prestige Falcon City", tenantId: "t-prestige", flats: 2700, city: "Bengaluru" },
  { id: "tw-5", name: "Sobha Forest View", tenantId: "t-sobha", flats: 1900, city: "Bengaluru" },
  { id: "tw-6", name: "DLF Camellias", tenantId: "t-dlf", flats: 980, city: "Gurugram" },
];

export type KpiTrend = { value: number; delta: number; label: string };

export const executiveKpis = {
  revenue: { value: 48_72_30_000, delta: 12.4, label: "Total Revenue (₹)" },
  consumption: { value: 28_45_120, delta: 4.2, label: "Consumption (KL)" },
  collectionEfficiency: { value: 94.6, delta: 1.8, label: "Collection Efficiency" },
  activeConsumers: { value: 16_842, delta: 2.1, label: "Active Consumers" },
  activeMeters: { value: 18_204, delta: 1.4, label: "Active Meters" },
  outstanding: { value: 3_84_12_500, delta: -5.6, label: "Outstanding (₹)" },
  nrw: { value: 14.8, delta: -2.3, label: "Non-Revenue Water" },
  faultyMeters: { value: 287, delta: -8.1, label: "Faulty Meters" },
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const revenueTrend = months.map((m, i) => ({
  month: m,
  revenue: int(35, 52) + i * 0.6,
  collected: int(32, 48) + i * 0.5,
  outstanding: int(3, 8),
}));

export const consumptionTrend = months.map((m) => ({
  month: m,
  domestic: int(180, 240),
  commercial: int(60, 110),
  common: int(20, 45),
}));

export const collectionEfficiencyTrend = months.map((m) => ({
  month: m,
  efficiency: 88 + rand() * 10,
}));

export const townshipComparison = townships.map((t) => ({
  name: t.name.split(" ").slice(0, 2).join(" "),
  revenue: int(80, 320),
  consumption: int(120, 480),
}));

export const outstandingAging = [
  { bucket: "0-30 days", amount: 142 },
  { bucket: "31-60 days", amount: 86 },
  { bucket: "61-90 days", amount: 54 },
  { bucket: "91-180 days", amount: 38 },
  { bucket: "180+ days", amount: 22 },
];

export const meterHealth = [
  { name: "Active", value: 17_350, color: "var(--color-success)" },
  { name: "Offline", value: 567, color: "var(--color-muted-foreground)" },
  { name: "Faulty", value: 287, color: "var(--color-critical)" },
  { name: "Low Battery", value: 142, color: "var(--color-warning)" },
];

export const readSuccessTrend = range(14).map((i) => ({
  day: `D-${14 - i}`,
  success: 92 + rand() * 7,
  failed: rand() * 6,
}));

export const realtimeIngestion = range(24).map((h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  reads: int(8000, 14000),
}));

const firstNames = ["Rajesh", "Priya", "Amit", "Sneha", "Vikram", "Ananya", "Rohit", "Kavya", "Arjun", "Meera", "Sandeep", "Pooja", "Ravi", "Divya", "Karthik", "Lakshmi", "Suresh", "Neha", "Manoj", "Ritu"];
const lastNames = ["Sharma", "Patel", "Reddy", "Iyer", "Nair", "Kumar", "Singh", "Mehta", "Gupta", "Rao", "Verma", "Chopra", "Bhat", "Joshi", "Menon"];

const tariffs = ["Residential-A", "Residential-B", "Commercial-Std", "Commercial-Premium", "TOU-Smart"];

export type Customer = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  townshipId: string;
  block: string;
  floor: number;
  flat: string;
  tariff: string;
  outstanding: number;
  lastReading: number;
  meterStatus: "Active" | "Offline" | "Faulty" | "Low Battery";
  connectionStatus: "Active" | "Suspended" | "Pending";
  occupancy: "Owner" | "Tenant" | "Vacant";
  meterId: string;
  joinedAt: string;
  kyc: "Verified" | "Pending" | "Rejected";
};

export const customers: Customer[] = range(120).map((i) => {
  const fn = pick(firstNames);
  const ln = pick(lastNames);
  const tw = pick(townships);
  const block = String.fromCharCode(65 + int(0, 5));
  const floor = int(1, 24);
  const flat = `${block}-${floor}${String(int(1, 8)).padStart(2, "0")}`;
  return {
    id: `CUS-${String(10000 + i).padStart(6, "0")}`,
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.com`,
    mobile: `+91 9${int(100000000, 999999999)}`,
    townshipId: tw.id,
    block,
    floor,
    flat,
    tariff: pick(tariffs),
    outstanding: rand() > 0.6 ? int(500, 28000) : 0,
    lastReading: int(12000, 88000),
    meterStatus: pick(["Active", "Active", "Active", "Active", "Offline", "Faulty", "Low Battery"]) as Customer["meterStatus"],
    connectionStatus: pick(["Active", "Active", "Active", "Suspended", "Pending"]) as Customer["connectionStatus"],
    occupancy: pick(["Owner", "Owner", "Tenant", "Vacant"]) as Customer["occupancy"],
    meterId: `MTR-${String(50000 + i).padStart(6, "0")}`,
    joinedAt: `202${int(1, 4)}-${String(int(1, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
    kyc: pick(["Verified", "Verified", "Verified", "Pending", "Rejected"]) as Customer["kyc"],
  };
});

export type Meter = {
  id: string;
  serial: string;
  type: "Domestic" | "Bulk" | "Commercial" | "Industrial";
  townshipId: string;
  flat: string;
  status: "Active" | "Offline" | "Faulty" | "Low Battery";
  lastRead: string;
  connectivity: "LoRa" | "NB-IoT" | "GSM" | "Wi-Fi";
  battery: number;
  signal: number;
  customerId: string;
  parentId?: string;
  installDate: string;
};

export const meters: Meter[] = customers.map((c, i) => ({
  id: c.meterId,
  serial: `SN${int(100000000, 999999999)}`,
  type: pick(["Domestic", "Domestic", "Domestic", "Bulk", "Commercial", "Industrial"]) as Meter["type"],
  townshipId: c.townshipId,
  flat: c.flat,
  status: c.meterStatus,
  lastRead: `${int(1, 59)} min ago`,
  connectivity: pick(["LoRa", "NB-IoT", "GSM", "Wi-Fi"]) as Meter["connectivity"],
  battery: int(35, 100),
  signal: int(40, 100),
  customerId: c.id,
  installDate: c.joinedAt,
}));

export type Bill = {
  id: string;
  customerId: string;
  customerName: string;
  township: string;
  period: string;
  consumption: number;
  amount: number;
  status: "Draft" | "Validated" | "Approved" | "Generated" | "Sent" | "Paid" | "Overdue";
  generatedAt: string;
  dueDate: string;
};

export const bills: Bill[] = customers.slice(0, 80).map((c, i) => {
  const consumption = int(8, 65);
  const amount = consumption * int(45, 95);
  const statuses: Bill["status"][] = ["Paid", "Paid", "Paid", "Sent", "Generated", "Overdue", "Approved", "Draft"];
  return {
    id: `INV-${String(202400 + i).padStart(7, "0")}`,
    customerId: c.id,
    customerName: c.name,
    township: townships.find((t) => t.id === c.townshipId)!.name,
    period: "Oct 2025",
    consumption,
    amount,
    status: pick(statuses),
    generatedAt: "2025-11-01",
    dueDate: "2025-11-15",
  };
});

export type Payment = {
  id: string;
  billId: string;
  customerName: string;
  amount: number;
  method: "UPI" | "Card" | "NetBanking" | "Wallet" | "Cash";
  status: "Success" | "Pending" | "Failed";
  date: string;
};

export const payments: Payment[] = bills.filter((b) => b.status === "Paid").map((b, i) => ({
  id: `PAY-${String(700000 + i).padStart(7, "0")}`,
  billId: b.id,
  customerName: b.customerName,
  amount: b.amount,
  method: pick(["UPI", "UPI", "UPI", "Card", "NetBanking", "Wallet"]) as Payment["method"],
  status: pick(["Success", "Success", "Success", "Success", "Pending", "Failed"]) as Payment["status"],
  date: `2025-11-${String(int(1, 28)).padStart(2, "0")}`,
}));

export type AlertCategory =
  | "Missing Readings"
  | "Billing Exceptions"
  | "Consumption Alerts"
  | "Revenue Leakage"
  | "Service Escalations"
  | "Operational Exceptions";

export type Alert = {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  category: AlertCategory;
  type: "Meter Offline" | "Leakage Detected" | "Reverse Flow" | "Billing Failure" | "Payment Overdue" | "Abnormal Consumption" | "Low Battery" | "Missing Reading";
  source: string;
  consumerName?: string;
  township: string;
  raisedAt: string;
  createdDate: string;
  status: "Open" | "Acknowledged" | "Resolved";
  assignee?: string;
  recommendedAction: string;
};

const typeToCategory: Record<Alert["type"], AlertCategory> = {
  "Missing Reading": "Missing Readings",
  "Billing Failure": "Billing Exceptions",
  "Abnormal Consumption": "Consumption Alerts",
  "Leakage Detected": "Revenue Leakage",
  "Reverse Flow": "Revenue Leakage",
  "Payment Overdue": "Service Escalations",
  "Meter Offline": "Operational Exceptions",
  "Low Battery": "Operational Exceptions",
};

const typeToAction: Record<Alert["type"], string> = {
  "Missing Reading": "Assign Reading Task",
  "Billing Failure": "Review Bill",
  "Abnormal Consumption": "Verify Consumption",
  "Leakage Detected": "Dispatch Field Team",
  "Reverse Flow": "Inspect Meter Installation",
  "Payment Overdue": "Send Payment Reminder",
  "Meter Offline": "Schedule Meter Diagnostic",
  "Low Battery": "Schedule Battery Replacement",
};

export const alertCategories: AlertCategory[] = [
  "Missing Readings",
  "Billing Exceptions",
  "Consumption Alerts",
  "Revenue Leakage",
  "Service Escalations",
  "Operational Exceptions",
];

export const alerts: Alert[] = range(48).map((i) => {
  const type = pick(["Meter Offline", "Leakage Detected", "Reverse Flow", "Billing Failure", "Payment Overdue", "Abnormal Consumption", "Low Battery", "Missing Reading", "Missing Reading", "Billing Failure"]) as Alert["type"];
  const d = new Date();
  d.setDate(d.getDate() - int(0, 29));
  return {
    id: `ALT-${String(10000 + i).padStart(6, "0")}`,
    severity: pick(["Critical", "High", "High", "Medium", "Medium", "Medium", "Low", "Low"]) as Alert["severity"],
    category: typeToCategory[type],
    type,
    source: `MTR-${String(50000 + int(0, 119)).padStart(6, "0")}`,
    consumerName: `${pick(firstNames)} ${pick(lastNames)}`,
    township: pick(townships).name,
    raisedAt: `${int(1, 23)}h ago`,
    createdDate: d.toISOString().slice(0, 10),
    status: pick(["Open", "Open", "Open", "Acknowledged", "Acknowledged", "Resolved"]) as Alert["status"],
    assignee: rand() > 0.5 ? pick(firstNames) : undefined,
    recommendedAction: typeToAction[type],
  };
});

export const topDefaulters = customers
  .filter((c) => c.outstanding > 0)
  .sort((a, b) => b.outstanding - a.outstanding)
  .slice(0, 8);

export const topConsumingTownships = townships.map((t) => ({
  name: t.name,
  consumption: int(2800, 9200),
  revenue: int(450, 1450),
  efficiency: int(82, 98),
})).sort((a, b) => b.consumption - a.consumption);

export const customerConsumption = months.map((m) => ({
  month: m,
  consumption: int(18, 42),
  bill: int(900, 2400),
}));

export const billingFunnel = [
  { stage: "Draft", count: 8420 },
  { stage: "Validated", count: 8240 },
  { stage: "Approved", count: 8100 },
  { stage: "Generated", count: 8040 },
  { stage: "Sent", count: 7980 },
  { stage: "Paid", count: 7240 },
];

export type Tariff = {
  id: string;
  name: string;
  type: "Fixed" | "Slab" | "TOU" | "Seasonal";
  version: string;
  status: "Active" | "Draft" | "Archived" | "Pending Approval";
  effectiveFrom: string;
  slabs: { from: number; to: number | null; rate: number }[];
  appliedTo: number;
};

export const tariffsList: Tariff[] = [
  { id: "trf-001", name: "Residential-A Slab", type: "Slab", version: "v3.2", status: "Active", effectiveFrom: "2025-04-01", appliedTo: 8420, slabs: [{ from: 0, to: 10, rate: 12 }, { from: 11, to: 20, rate: 18 }, { from: 21, to: 35, rate: 26 }, { from: 36, to: null, rate: 38 }] },
  { id: "trf-002", name: "Residential-B Slab", type: "Slab", version: "v2.1", status: "Active", effectiveFrom: "2025-04-01", appliedTo: 4280, slabs: [{ from: 0, to: 15, rate: 10 }, { from: 16, to: 30, rate: 16 }, { from: 31, to: null, rate: 24 }] },
  { id: "trf-003", name: "Commercial Standard", type: "Fixed", version: "v1.4", status: "Active", effectiveFrom: "2025-01-01", appliedTo: 1850, slabs: [{ from: 0, to: null, rate: 48 }] },
  { id: "trf-004", name: "Commercial Premium", type: "Fixed", version: "v1.1", status: "Active", effectiveFrom: "2025-01-01", appliedTo: 620, slabs: [{ from: 0, to: null, rate: 62 }] },
  { id: "trf-005", name: "TOU-Smart", type: "TOU", version: "v1.0", status: "Pending Approval", effectiveFrom: "2026-01-01", appliedTo: 0, slabs: [{ from: 0, to: null, rate: 22 }] },
  { id: "trf-006", name: "Seasonal Summer", type: "Seasonal", version: "v2.0", status: "Draft", effectiveFrom: "2026-03-01", appliedTo: 0, slabs: [{ from: 0, to: null, rate: 28 }] },
];

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  category: "Tariff" | "Bill" | "Meter" | "User" | "Read";
};

export const auditLog: AuditEntry[] = range(40).map((i) => ({
  id: `LOG-${String(900000 + i).padStart(7, "0")}`,
  actor: pick(firstNames) + " " + pick(lastNames),
  action: pick(["created", "updated", "approved", "rejected", "deleted", "corrected"]),
  entity: pick(["Tariff", "Bill", "Meter Read", "User", "Connection"]),
  entityId: `${pick(["TRF", "INV", "MTR", "USR"])}-${int(100000, 999999)}`,
  timestamp: `2025-11-${String(int(1, 28)).padStart(2, "0")} ${String(int(0, 23)).padStart(2, "0")}:${String(int(0, 59)).padStart(2, "0")}`,
  category: pick(["Tariff", "Bill", "Meter", "User", "Read"]) as AuditEntry["category"],
}));

export const usersList = range(18).map((i) => ({
  id: `USR-${String(1000 + i).padStart(5, "0")}`,
  name: `${pick(firstNames)} ${pick(lastNames)}`,
  email: `user${i}@utility.io`,
  role: pick(["Super Admin", "Utility Owner", "Admin Owner", "Billing Operator", "Meter Operator", "Consumer"]),
  status: pick(["Active", "Active", "Active", "Inactive"]),
  lastLogin: `${int(1, 48)}h ago`,
}));

export const roles = ["Super Admin", "Utility Owner", "Admin Owner", "Billing Operator", "Meter Operator", "Consumer"];
export const permissions = [
  "Dashboard.View", "Customer.Create", "Customer.Edit", "Customer.Delete",
  "Meter.Read", "Meter.Configure", "Bill.Generate", "Bill.Approve",
  "Tariff.Create", "Tariff.Approve", "Payment.Reconcile", "Reports.Export",
  "Admin.Users", "Admin.Settings",
];

// Permission matrix (role x permission -> boolean)
export const rolePermissions: Record<string, Set<string>> = {
  "Super Admin": new Set(permissions),
  "Utility Owner": new Set(permissions.filter((p) => !p.startsWith("Admin"))),
  "Admin Owner": new Set(["Dashboard.View", "Customer.Create", "Customer.Edit", "Meter.Read", "Bill.Generate", "Reports.Export"]),
  "Billing Operator": new Set(["Dashboard.View", "Bill.Generate", "Bill.Approve", "Payment.Reconcile", "Tariff.Create"]),
  "Meter Operator": new Set(["Dashboard.View", "Meter.Read", "Meter.Configure"]),
  "Consumer": new Set(["Dashboard.View"]),
};

export const readExceptions = range(24).map((i) => ({
  id: `RX-${String(50000 + i).padStart(6, "0")}`,
  meterId: pick(meters).id,
  type: pick(["Negative Consumption", "Sudden Spike", "Zero Consumption", "Reverse Flow", "Missing Read", "Stuck Meter"]),
  detectedAt: `${int(1, 23)}h ago`,
  severity: pick(["Critical", "High", "Medium"]) as Alert["severity"],
  status: pick(["Open", "Acknowledged", "Resolved"]),
}));

export const readCycles = [
  { id: "RC-001", name: "Monthly Residential", frequency: "Monthly", meters: 14820, nextRun: "01 Dec 2025", status: "Active", lastRun: "01 Nov 2025" },
  { id: "RC-002", name: "Daily Bulk Meters", frequency: "Daily", meters: 124, nextRun: "Today, 23:00", status: "Active", lastRun: "Today, 11:00" },
  { id: "RC-003", name: "Weekly Commercial", frequency: "Weekly", meters: 2380, nextRun: "06 Dec 2025", status: "Active", lastRun: "29 Nov 2025" },
  { id: "RC-004", name: "Hourly Industrial", frequency: "Hourly", meters: 48, nextRun: "Next hour", status: "Active", lastRun: "15 min ago" },
];

export const notifications = [
  { id: "n1", title: "Billing run completed", body: "8,040 invoices generated for Oct 2025", time: "12 min ago", type: "success" },
  { id: "n2", title: "Critical: Reverse flow detected", body: "Block C-Tower 12, Prestige Lakeside", time: "1h ago", type: "critical" },
  { id: "n3", title: "Tariff approval pending", body: "TOU-Smart v1.0 awaiting your review", time: "3h ago", type: "warning" },
  { id: "n4", title: "Collection target achieved", body: "November collection: ₹4.2 Cr (102% of target)", time: "Yesterday", type: "success" },
];

export const formatCurrency = (v: number) => {
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)} Cr`;
  if (v >= 1_00_000) return `₹${(v / 1_00_000).toFixed(2)} L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${v.toFixed(0)}`;
};

export const formatNumber = (v: number) => new Intl.NumberFormat("en-IN").format(Math.round(v));

// Deterministic consumer avatar URL based on customer id (pravatar 1..70)
export const customerAvatar = (id: string) => {
  const n = parseInt(id.replace(/\D/g, "")) || 1;
  return `https://i.pravatar.cc/120?img=${(n % 70) + 1}`;
};
export const customerInitials = (name: string) =>
  name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

// ============= Billing Insights & Consumption Analytics =============

export const consumerCategories = ["Residential", "Commercial", "Industrial", "Bulk", "Common Area"] as const;
export type ConsumerCategory = typeof consumerCategories[number];

export const billingCycles = ["Monthly", "Bi-Monthly", "Quarterly"] as const;

export const billingInsightsKpis = {
  billsGenerated: { value: 8_040, delta: 2.4, label: "Bills Generated" },
  totalBilled: { value: 4_82_30_000, delta: 6.8, label: "Total Billed Amount (₹)" },
  billingAccuracy: { value: 98.4, delta: 0.6, label: "Billing Accuracy %" },
  billingExceptions: { value: 124, delta: -8.2, label: "Billing Exceptions" },
};

export const monthlyBillingTrend = months.map((m, i) => ({
  month: m,
  billed: int(38, 56) + i * 0.4,
  exceptions: int(40, 180),
}));

export const billsGeneratedByMonth = months.map((m) => ({
  month: m,
  bills: int(7400, 8400),
}));

export const billingExceptionAnalysis = [
  { type: "Missing Reading", count: 42 },
  { type: "Negative Consumption", count: 18 },
  { type: "Tariff Mismatch", count: 22 },
  { type: "Zero Consumption", count: 14 },
  { type: "Estimation Override", count: 16 },
  { type: "Validation Failure", count: 12 },
];

export const consumptionKpis = {
  total: { value: 28_45_120, delta: 4.2, label: "Total Consumption (KL)" },
  average: { value: 18.4, delta: 0.6, label: "Avg Consumption / Consumer (KL)" },
  highConsumers: { value: 264, delta: 3.1, label: "High Consumption Consumers" },
  zeroConsumers: { value: 142, delta: -1.4, label: "Zero Consumption Consumers" },
};

export const consumptionByCategory = [
  { name: "Residential", value: 1_82_400, color: "var(--color-chart-1, oklch(0.42 0.16 258))" },
  { name: "Commercial", value: 62_180, color: "var(--color-chart-2, oklch(0.62 0.16 215))" },
  { name: "Industrial", value: 28_640, color: "var(--color-chart-3, oklch(0.62 0.14 155))" },
  { name: "Bulk", value: 18_420, color: "var(--color-chart-4, oklch(0.72 0.16 75))" },
  { name: "Common Area", value: 12_780, color: "var(--color-chart-6, oklch(0.55 0.18 295))" },
];

export const topConsumersByUsage = customers.slice(0, 30).map((c, i) => ({
  id: c.id,
  name: c.name,
  township: townships.find((t) => t.id === c.townshipId)?.name ?? "",
  flat: c.flat,
  category: (pick(["Residential", "Residential", "Commercial", "Bulk", "Industrial"]) as ConsumerCategory),
  consumption: int(120, 480) - i * 2,
  amount: int(8_000, 42_000),
})).sort((a, b) => b.consumption - a.consumption);

export const highConsumptionConsumers = topConsumersByUsage.slice(0, 12);

export const zeroConsumptionConsumers = customers.slice(80, 92).map((c) => ({
  id: c.id,
  name: c.name,
  township: townships.find((t) => t.id === c.townshipId)?.name ?? "",
  flat: c.flat,
  lastReadingDate: `2025-${String(int(8, 10)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
  daysIdle: int(35, 120),
}));
