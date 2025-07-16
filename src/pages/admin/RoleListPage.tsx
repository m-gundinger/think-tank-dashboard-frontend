import { RoleList } from "@/features/admin/roles/components/RoleList";
import { CreateRoleDialog } from "@/features/admin/roles/components/CreateRoleDialog";

export function RoleListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            View, create, and manage system roles and their permissions.
          </p>
        </div>
        <CreateRoleDialog />
      </div>
      <RoleList />
    </div>
  );
}
