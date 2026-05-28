import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormDialog } from "@/components/ui/form-dialog";

export const Route = createFileRoute("/_app/admin/holidays")({ component: Page });

type H = { id: string; name: string; date: string; day: string; region: string; type: string };
const data: H[] = [
  { id: "H-01", name: "Republic Day", date: "26 Jan 2026", day: "Monday", region: "India", type: "National" },
  { id: "H-02", name: "Holi", date: "04 Mar 2026", day: "Wednesday", region: "India", type: "National" },
  { id: "H-03", name: "Good Friday", date: "03 Apr 2026", day: "Friday", region: "India", type: "National" },
  { id: "H-04", name: "Eid al-Fitr", date: "21 Mar 2026", day: "Saturday", region: "India", type: "National" },
  { id: "H-05", name: "Karnataka Rajyotsava", date: "01 Nov 2026", day: "Sunday", region: "Karnataka", type: "Regional" },
  { id: "H-06", name: "Independence Day", date: "15 Aug 2026", day: "Saturday", region: "India", type: "National" },
  { id: "H-07", name: "Gandhi Jayanti", date: "02 Oct 2026", day: "Friday", region: "India", type: "National" },
  { id: "H-08", name: "Diwali", date: "08 Nov 2026", day: "Sunday", region: "India", type: "National" },
];

function Page() {
  const cols: Column<H>[] = [
    { key: "name", header: "Holiday", accessor: (r) => <span className="font-medium">{r.name}</span>, sortValue: (r) => r.name },
    { key: "date", header: "Date", accessor: (r) => r.date },
    { key: "day", header: "Day", accessor: (r) => <span className="text-muted-foreground">{r.day}</span> },
    { key: "region", header: "Region", accessor: (r) => r.region },
    { key: "type", header: "Type", accessor: (r) => <span className="rounded-md bg-info-soft px-2 py-0.5 text-xs font-medium text-info">{r.type}</span> },
  ];
  return (
    <>
      <PageHeader title="Holiday Calendar" description="Suspended billing runs and field operations on these dates" actions={
        <Button size="sm" onClick={() => toast.success("Holiday added")}><Plus className="mr-1.5 h-4 w-4" /> Add holiday</Button>
      } />
      <DataTable data={data} columns={cols} rowKey={(r) => r.id} />
    </>
  );
}
