import { PermissionList } from "@/features/admin/permissions/components/PermissionList";
import { ListPageLayout } from "@/components/layout/ListPageLayout";

export function PermissionListPage() {
  return (
    <ListPageLayout
      title="System Permissions"
      description="A read-only list of all available permissions in the system."
    >
      <PermissionList />
    </ListPageLayout>
  );
}