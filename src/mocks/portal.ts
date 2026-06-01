// Consumer portal mock data — derived from the same model used by the
// utility-side modules. Deterministic so the demo stays stable.
import { customers, townships, formatCurrency } from "./data";

export { formatCurrency };

const months = ["Dec 24", "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25", "Sep 25", "Oct 25", "Nov 25"];

const base = customers[3];
const township = townships.find((t) => t.id === base.townshipId)!;

export const consumer = {
  id: base.id,
  name: base.name,
  connectionNo: `CN-${base.id.replace("CUS-", "")}`,
  address: `${base.flat}, ${township.name}, ${township.city}`,
  email: base.email,
  mobile: base.mobile,
  altMobile: "+91 98455 23410",
  tariff: base.tariff,
  meterId: base.meterId,
  meterSerial: "SN740112883",
  connectionStatus: base.connectionStatus,
  joinedAt: base.joinedAt,
  kyc: base.kyc,
  occupancy: base.occupancy,
  comms: { email: true, sms: true, whatsapp: true, push: false },
};

// 12 month consumption history (KL) + bills (₹)
export const consumptionHistory = months.map((m, i) => {
  const seasonal = 22 + Math.sin((i / 12) * Math.PI * 2) * 6;
  const consumption = +(seasonal + (i % 3) * 1.4).toFixed(1);
  const tariffRate = 78 + (i % 4) * 3;
  return {
    month: m,
    consumption,
    bill: Math.round(consumption * tariffRate),
    avg: 24.2,
  };
});

export const currentMonthKL = consumptionHistory[consumptionHistory.length - 1].consumption;
export const previousMonthKL = consumptionHistory[consumptionHistory.length - 2].consumption;
export const averageKL = +(consumptionHistory.reduce((a, b) => a + b.consumption, 0) / consumptionHistory.length).toFixed(1);
export const peakKL = Math.max(...consumptionHistory.map((c) => c.consumption));

// 30-day daily trend
export const dailyConsumption = Array.from({ length: 30 }, (_, i) => {
  const base = 0.7 + Math.abs(Math.sin(i * 0.6)) * 0.6;
  return { day: `${i + 1}`, kl: +(base + (i % 7 === 0 ? 0.4 : 0)).toFixed(2) };
});

// Meter reading history
export const meterReadings = Array.from({ length: 12 }, (_, i) => {
  const reading = 18420 + i * 24 + Math.round(Math.sin(i) * 8);
  return {
    date: `${String((i % 28) + 1).padStart(2, "0")} ${months[i]}`,
    reading,
    consumption: consumptionHistory[i].consumption,
    type: i % 4 === 0 ? "Manual" : "Auto",
  };
});

// 10 sample bills
export const portalBills = consumptionHistory.slice(-10).reverse().map((c, i) => {
  const id = `INV-2025${String(110 - i).padStart(4, "0")}`;
  const statusPool: Array<"Paid" | "Sent" | "Overdue" | "Generated"> = ["Sent", "Paid", "Paid", "Paid", "Paid", "Paid", "Paid", "Paid", "Paid", "Paid"];
  const status = i === 0 ? "Sent" : i === 1 ? "Overdue" : "Paid";
  const taxes = Math.round(c.bill * 0.18);
  return {
    id,
    period: c.month,
    billDate: `01 ${c.month}`,
    dueDate: `15 ${c.month}`,
    consumption: c.consumption,
    amount: c.bill + taxes,
    base: c.bill,
    taxes,
    status,
    tariff: consumer.tariff,
    breakdown: [
      { label: "Water charges", value: Math.round(c.bill * 0.74) },
      { label: "Sewerage charges", value: Math.round(c.bill * 0.18) },
      { label: "Service charges", value: Math.round(c.bill * 0.08) },
      { label: "GST @ 18%", value: taxes },
    ],
  };
});

export const currentBill = portalBills[0];

// 5 service requests
export type PortalRequest = {
  id: string;
  category: "Billing Issue" | "Meter Issue" | "Connection Issue" | "Water Supply Issue" | "General Inquiry";
  subject: string;
  description: string;
  raisedAt: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  updates: { at: string; note: string }[];
};

export const portalRequests: PortalRequest[] = [
  {
    id: "SR-2025-00481",
    category: "Billing Issue",
    subject: "Discrepancy in October bill",
    description: "Bill amount seems higher than usual consumption pattern.",
    raisedAt: "12 Nov 2025",
    status: "In Progress",
    updates: [
      { at: "12 Nov", note: "Request received and assigned to billing team" },
      { at: "14 Nov", note: "Meter reading re-verified, awaiting tariff review" },
    ],
  },
  {
    id: "SR-2025-00422",
    category: "Meter Issue",
    subject: "Low battery indicator on meter",
    description: "Display blinks intermittently — please inspect.",
    raisedAt: "28 Oct 2025",
    status: "Resolved",
    updates: [
      { at: "28 Oct", note: "Field visit scheduled" },
      { at: "31 Oct", note: "Battery replaced, meter restored" },
    ],
  },
  {
    id: "SR-2025-00388",
    category: "Water Supply Issue",
    subject: "Low pressure during morning hours",
    description: "Supply pressure drops between 6-8 AM regularly.",
    raisedAt: "14 Oct 2025",
    status: "Closed",
    updates: [
      { at: "14 Oct", note: "Logged with operations" },
      { at: "20 Oct", note: "Booster pump recalibrated, issue resolved" },
    ],
  },
  {
    id: "SR-2025-00301",
    category: "General Inquiry",
    subject: "Tariff slab clarification",
    description: "Request for breakup of slab-wise tariff rates.",
    raisedAt: "02 Oct 2025",
    status: "Resolved",
    updates: [{ at: "03 Oct", note: "Tariff sheet shared on email" }],
  },
  {
    id: "SR-2025-00255",
    category: "Connection Issue",
    subject: "Update co-owner name on connection",
    description: "Add spouse as joint holder on the connection record.",
    raisedAt: "20 Sep 2025",
    status: "Open",
    updates: [{ at: "20 Sep", note: "Documents pending verification" }],
  },
];

// Notifications
export type PortalNotification = {
  id: string;
  type: "Bill" | "Reminder" | "Service" | "Reading" | "Alert";
  title: string;
  body: string;
  at: string;
  read: boolean;
};

export const portalNotifications: PortalNotification[] = [
  { id: "N-1201", type: "Bill", title: "New bill generated", body: `Your November bill of ${formatCurrency(currentBill.amount)} is ready.`, at: "2h ago", read: false },
  { id: "N-1200", type: "Alert", title: "High consumption alert", body: "Yesterday's usage was 38% above your daily average.", at: "1d ago", read: false },
  { id: "N-1198", type: "Service", title: "Service request update", body: "SR-2025-00481 moved to In Progress.", at: "2d ago", read: false },
  { id: "N-1192", type: "Reminder", title: "Bill due reminder", body: `${formatCurrency(currentBill.amount)} due on 15 Nov 2025.`, at: "3d ago", read: true },
  { id: "N-1180", type: "Reading", title: "Meter reading reminder", body: "Auto reading scheduled for tomorrow 09:00.", at: "5d ago", read: true },
  { id: "N-1175", type: "Bill", title: "Payment received", body: `Thank you. Payment of ${formatCurrency(portalBills[2].amount)} confirmed.`, at: "1w ago", read: true },
  { id: "N-1162", type: "Service", title: "SR-2025-00422 resolved", body: "Meter battery replaced successfully.", at: "2w ago", read: true },
  { id: "N-1150", type: "Alert", title: "Possible leak detected", body: "Continuous flow observed between 02:00-04:00.", at: "3w ago", read: true },
];
