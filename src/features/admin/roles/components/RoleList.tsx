import { useState } from "react";
import { ResourceCrudDialog } from "@/components/shared/ResourceCrudDialog";
import { RoleCard } from "./RoleCard";
import { RoleForm } from "./RoleForm";
import { ManageRolePermissions } from "./ManageRolePermissions";
import { useManageRoles } from "../api/useManageRoles";

export function RoleList() {
  const { useGetAll } = useManageRoles();
  const { data, isLoading, isError } = useGetAll();
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  if (isLoading) return <div>Loading roles...</div>;
  if (isError) return <div>Error loading roles.</div>;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.data?.map((role) => (
          <RoleCard key={role.id} role={role} onEdit={setEditingRoleId} />
        ))}
      </div>
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
    </>
  );
}