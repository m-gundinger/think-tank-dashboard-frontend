import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { RoleCard } from "@/features/admin/roles/components/RoleCard";
import { RoleForm } from "@/features/admin/roles/components/RoleForm";
import { useManageRoles } from "@/features/admin/roles/api/useManageRoles";
import { ManageRolePermissions } from "@/features/admin/roles/components/ManageRolePermissions";
import { Button } from "@/components/ui/button";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export function RoleListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { useGetAll } = useManageRoles();
  const { data, isLoading, isError } = useGetAll();
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  return (
    <ListPageLayout
      title="Role Management"
      description="View system roles and their assigned permissions."
      actionButton={
        <ResourceCrudDialog
          isOpen={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <Button onClick={() => setIsCreateOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Role
            </Button>
          }
          title="Create New Role"
          description="Create a new system-wide role. You can assign permissions after creation."
          form={RoleForm}
          resourcePath="admin/roles"
          resourceKey={["roles"]}
        />
      }
    >
      {isLoading && <div>Loading roles...</div>}
      {isError && <div>Error loading roles.</div>}
      {data && (
        <div className="grid gap-4 md:grid-cols-2">
          {data.data?.map((role) => (
            <RoleCard key={role.id} role={role} onEdit={setEditingRoleId} />
          ))}
        </div>
      )}
      <ResourceCrudDialog
        resourceId={editingRoleId}
        resourcePath="admin/roles"
        resourceKey={["roles"]}
        title="Edit Role"
        description="Update role details and manage assigned permissions."
        form={RoleForm}
        isOpen={!!editingRoleId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingRoleId(null);
        }}
        dialogClassName="sm:max-w-4xl"
      >
        {(role) => <ManageRolePermissions role={role} />}
      </ResourceCrudDialog>
    </ListPageLayout>
  );
}
