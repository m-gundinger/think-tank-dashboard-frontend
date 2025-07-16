import { PermissionList } from "@/features/admin/permissions/components/PermissionList";
import { CreatePermissionDialog } from "@/features/admin/permissions/components/CreatePermissionDialog";

export function PermissionListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            System Permissions
          </h1>
          <p className="text-muted-foreground">
            Manage all available permissions in the system.
          </p>
        </div>
        <CreatePermissionDialog />
      </div>
      <PermissionList />
    </div>
  );
}
