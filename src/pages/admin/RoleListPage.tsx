import { RoleList } from "@/features/admin/roles/components/RoleList";

export function RoleListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground">
            View system roles and their assigned permissions.
          </p>
        </div>
      </div>
      <RoleList />
    </div>
  );
}
