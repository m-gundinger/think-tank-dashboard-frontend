import { Badge } from "@/components/ui/badge";
import { EntityCard } from "@/components/shared/EntityCard";
import { Role } from "@/types";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { useManageRoles } from "../api/useManageRoles";

interface RoleCardProps {
  role: Role;
  onEdit: (roleId: string) => void;
}

export function RoleCard({ role, onEdit }: RoleCardProps) {
  const { useDelete } = useManageRoles();
  const deleteMutation = useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete the "${role.name}" role? This action cannot be undone.`
      )
    ) {
      deleteMutation.mutate(role.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(role.id);
  };

  return (
    <EntityCard
      title={role.name}
      description={role.description || "No description."}
      actions={
        <ActionMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
      }
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-sm font-semibold">Permissions:</span>
          {role.permissions?.length > 0 ? (
            role.permissions.map((p) => (
              <Badge variant="outline" key={p.id}>
                {p.action} on {p.subject}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">None</span>
          )}
        </div>
      </div>
    </EntityCard>
  );
}