import { EntityCard } from "@/components/ui/EntityCard";
import { useManageWhiteboards } from "../api/useManageWhiteboards";
import { LayoutDashboard } from "lucide-react";

interface Whiteboard {
  id: string;
  name: string;
  workspaceId: string;
  projectId: string;
  project: {
    name: string;
  };
  createdAt: string;
}

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
      onEdit={handleEdit}
      onDelete={handleDelete}
      deleteDisabled={deleteMutation.isPending}
      icon={LayoutDashboard}
    >
      <></>
    </EntityCard>
  );
}
