import { PermissionList } from "@/features/admin/permissions/components/PermissionList";

export function PermissionListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          System Permissions
        </h1>
        <p className="text-muted-foreground">
          A read-only list of all available permissions in the system.
        </p>
      </div>
      <PermissionList />
    </div>
  );
}
