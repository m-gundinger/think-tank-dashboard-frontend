import { EntityCard } from "@/components/shared/EntityCard";
import { useManageWhiteboards } from "../api/useManageWhiteboards";
import { LayoutDashboard } from "lucide-react";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { Whiteboard } from "@/types";

interface WhiteboardCardProps {
  whiteboard: Whiteboard;
  onEdit: () => void;
}

export function WhiteboardCard({ whiteboard, onEdit }: WhiteboardCardProps) {
  const { useDelete } = useManageWhiteboards();
  const deleteMutation = useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete the whiteboard "${whiteboard.name}"?`
      )
    ) {
      deleteMutation.mutate(whiteboard.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit();
  };

  return (
    <EntityCard
      title={whiteboard.name}
      description={`Created: ${new Date(
        whiteboard.createdAt
      ).toLocaleDateString()}`}
      icon={LayoutDashboard}
      actions={
        <ActionMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
      }
    >
      <></>
    </EntityCard>
  );
}
