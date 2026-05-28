import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Battery, BatteryLow, Wifi, Plus } from "lucide-react";
import { meters, townships, Meter } from "@/mocks/data";
import { toast } from "sonner";
import { FormDialog } from "@/components/ui/form-dialog";

export const Route = createFileRoute("/_app/meters/")({ component: MetersList });

function MetersList() {
  const nav = useNavigate();
  const twMap = Object.fromEntries(townships.map((t) => [t.id, t.name]));

  const columns: Column<Meter>[] = [
    { key: "id", header: "Meter ID", accessor: (r) => <span className="font-mono text-xs">{r.id}</span>, sortValue: (r) => r.id },
    { key: "serial", header: "Serial", accessor: (r) => <span className="font-mono text-xs text-muted-foreground">{r.serial}</span>, sortValue: (r) => r.serial },
    { key: "type", header: "Type", accessor: (r) => r.type, sortValue: (r) => r.type },
    { key: "township", header: "Township", accessor: (r) => <span className="text-xs">{twMap[r.townshipId]}</span>, sortValue: (r) => twMap[r.townshipId] },
    { key: "flat", header: "Flat", accessor: (r) => r.flat, sortValue: (r) => r.flat },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot />, sortValue: (r) => r.status },
    { key: "connectivity", header: "Conn", accessor: (r) => <span className="inline-flex items-center gap-1 text-xs"><Wifi className="h-3 w-3" /> {r.connectivity}</span>, sortValue: (r) => r.connectivity },
    { key: "battery", header: "Battery", accessor: (r) => (
      <div className="flex items-center gap-1.5">
        {r.battery < 40 ? <BatteryLow className="h-3.5 w-3.5 text-critical" /> : <Battery className="h-3.5 w-3.5 text-success" />}
        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
          <div className={`h-full ${r.battery < 40 ? "bg-critical" : r.battery < 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${r.battery}%` }} />
        </div>
        <span className="text-xs tabular-nums">{r.battery}%</span>
      </div>
    ), sortValue: (r) => r.battery },
    { key: "lastRead", header: "Last read", accessor: (r) => <span className="text-xs text-muted-foreground">{r.lastRead}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Meters"
        description={`${meters.length.toLocaleString("en-IN")} IoT meters under management`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.success("Reads CSV upload accepted")}>Upload reads</Button>
            <FormDialog
              trigger={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add meter</Button>}
              title="Onboard a new meter"
              description="Register a new IoT meter into the fleet."
              successMessage="Meter onboarded successfully"
              fields={[
                { name: "serial", label: "Serial number", required: true, placeholder: "e.g. KM-2025-09812" },
                { name: "type", label: "Type", type: "select", required: true, options: ["Residential", "Commercial", "Industrial", "Bulk"] },
                { name: "township", label: "Township", type: "select", required: true, options: townships.map((t) => t.name) },
                { name: "flat", label: "Flat / location", required: true, placeholder: "e.g. A-1204" },
                { name: "connectivity", label: "Connectivity", type: "select", required: true, options: ["LoRaWAN", "NB-IoT", "GSM", "WiFi"] },
              ]}
            />
          </>
        }
      />
      <DataTable
        data={meters}
        columns={columns}
        searchKeys={["id", "serial", "flat", "type"]}
        searchPlaceholder="Search meter ID, serial, flat..."
        rowKey={(r) => r.id}
        onRowClick={(r) => nav({ to: "/meters/$id", params: { id: r.id } })}
        pageSize={12}
      />
    </>
  );
}
