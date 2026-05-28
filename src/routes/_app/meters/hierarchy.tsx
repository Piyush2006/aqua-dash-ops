import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { ChevronRight, ChevronDown, Droplets } from "lucide-react";
import { useState } from "react";
import { townships } from "@/mocks/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/meters/hierarchy")({ component: HierarchyPage });

type Node = { id: string; name: string; status: "Active" | "Offline" | "Faulty"; flow?: string; children?: Node[] };

function buildTree(): Node[] {
  return townships.slice(0, 3).map((t, ti) => ({
    id: `tw-${ti}`, name: `${t.name} (Township)`, status: "Active", flow: `${(t.flats * 0.8).toFixed(0)} KL/d`,
    children: ["A", "B", "C"].map((b) => ({
      id: `b-${ti}-${b}`, name: `Block ${b}`, status: "Active", flow: `${Math.round(180 + Math.random() * 100)} KL/d`,
      children: ["Cluster-1", "Cluster-2"].map((cl) => ({
        id: `c-${ti}-${b}-${cl}`, name: cl, status: Math.random() > 0.85 ? "Faulty" : "Active", flow: `${Math.round(60 + Math.random() * 40)} KL/d`,
        children: Array.from({ length: 4 }).map((_, i) => ({
          id: `f-${ti}-${b}-${cl}-${i}`, name: `Flat ${b}-${(i + 1) * 102}`, status: Math.random() > 0.9 ? "Offline" : "Active",
          flow: `${Math.round(8 + Math.random() * 18)} KL/m`,
        })),
      })),
    })),
  }));
}

function TreeNode({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = !!node.children?.length;
  const statusColor = node.status === "Active" ? "bg-success" : node.status === "Faulty" ? "bg-critical" : "bg-muted-foreground";

  return (
    <div>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        className={cn("flex items-center gap-2 rounded-lg p-2 text-sm transition-colors hover:bg-surface", hasChildren && "cursor-pointer")}
        style={{ marginLeft: depth * 20 }}
      >
        <div className="w-4">
          {hasChildren ? (open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />) : null}
        </div>
        <span className={cn("h-2 w-2 shrink-0 rounded-full", statusColor)} />
        <Droplets className="h-3.5 w-3.5 text-primary/60" />
        <span className="font-medium">{node.name}</span>
        {node.flow && <span className="ml-auto text-xs tabular-nums text-muted-foreground">{node.flow}</span>}
      </div>
      {open && hasChildren && (
        <div className="border-l ml-3 pl-1">
          {node.children!.map((c) => <TreeNode key={c.id} node={c} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

function HierarchyPage() {
  const tree = buildTree();
  return (
    <>
      <PageHeader title="Meter Hierarchy" description="Topology visualization across township → block → cluster → flat" />
      <div className="grid gap-4 lg:grid-cols-[1fr,260px]">
        <div className="rounded-xl border bg-card p-3 shadow-card">
          {tree.map((n) => <TreeNode key={n.id} node={n} />)}
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <p className="mb-3 text-sm font-semibold">Legend</p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Active</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Offline</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-critical" /> Faulty</li>
          </ul>
          <div className="mt-6 space-y-2 text-xs text-muted-foreground">
            <p><strong className="text-foreground">Water balance:</strong> 96.2% of bulk flow reconciles to flat meters. NRW: 3.8%.</p>
          </div>
        </div>
      </div>
    </>
  );
}
