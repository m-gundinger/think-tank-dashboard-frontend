import { useGetRoles } from "../api/useGetRoles";
import { useState } from "react";
import { EditRoleDialog } from "./EditRoleDialog";
import { RoleCard } from "./RoleCard";

export function RoleList() {
  const { data, isLoading, isError } = useGetRoles();
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  if (isLoading) return <div>Loading roles...</div>;
  if (isError) return <div>Error loading roles.</div>;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.data?.map((role: any) => (
          <RoleCard key={role.id} role={role} onEdit={setEditingRoleId} />
        ))}
      </div>
      <EditRoleDialog
        roleId={editingRoleId}
        isOpen={!!editingRoleId}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditingRoleId(null);
        }}
      />
    </>
  );
}
