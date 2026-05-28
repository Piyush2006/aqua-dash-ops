import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { usersList, roles, permissions, rolePermissions } from "@/mocks/data";
import { toast } from "sonner";
import { FormDialog } from "@/components/ui/form-dialog";

export const Route = createFileRoute("/_app/admin/users")({ component: Page });

function Page() {
  const cols: Column<typeof usersList[number]>[] = [
    { key: "id", header: "ID", accessor: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "name", header: "Name", accessor: (r) => <div><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.email}</p></div>, sortValue: (r) => r.name },
    { key: "role", header: "Role", accessor: (r) => <span className="rounded-md bg-info-soft px-2 py-0.5 text-xs font-medium text-info">{r.role}</span> },
    { key: "lastLogin", header: "Last Login", accessor: (r) => r.lastLogin },
    { key: "status", header: "Status", accessor: (r) => <StatusBadge status={r.status} dot /> },
  ];
  return (
    <>
      <PageHeader title="Users & Roles" description="Identity, access and permission management" actions={
        <FormDialog
          trigger={<Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Invite user</Button>}
          title="Invite a new user"
          description="Send an invite email with a role assignment."
          successMessage="User invite sent"
          fields={[
            { name: "name", label: "Full name", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "role", label: "Role", type: "select", required: true, options: roles.map((r) => r.name) },
          ]}
        />
      } />
      <DataTable data={usersList} columns={cols} rowKey={(r) => r.id} searchKeys={["name", "email", "role"]} />

      <div className="mt-8 rounded-xl border bg-card p-5 shadow-card">
        <h3 className="mb-4 text-sm font-semibold">Permission Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4 text-left font-medium text-muted-foreground">Permission</th>
                {roles.map((r) => <th key={r} className="px-2 py-2 text-center font-medium text-muted-foreground">{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {permissions.map((p) => (
                <tr key={p} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{p}</td>
                  {roles.map((r) => (
                    <td key={r} className="px-2 py-2 text-center">
                      {rolePermissions[r]?.has(p) ? <Check className="mx-auto h-3.5 w-3.5 text-success" /> : <span className="text-muted-foreground">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
