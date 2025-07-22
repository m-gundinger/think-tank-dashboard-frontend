// FILE: src/features/views/components/ViewCard.tsx
import { EntityCard } from "@/components/ui/EntityCard";
import { useManageViews } from "../api/useManageViews";

interface ViewCardProps {
  view: any;
  workspaceId: string;
  projectId: string;
  onEdit: () => void;
}

export function ViewCard({
  view,
  workspaceId,
  projectId,
  onEdit,
}: ViewCardProps) {
  const { useDelete } = useManageViews(workspaceId, projectId);
  const deleteMutation = useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      window.confirm(`Are you sure you want to delete the "${view.name}" view?`)
    ) {
      deleteMutation.mutate(view.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit();
  };

  return (
    <EntityCard
      title={view.name}
      description={`View Type: ${view.type}`}
      onEdit={handleEdit}
      onDelete={handleDelete}
      deleteDisabled={deleteMutation.isPending}
    >
      <div className="text-muted-foreground text-sm">
        {view.columns.length > 0
          ? `${view.columns.length} columns`
          : "No specific columns configured"}
      </div>
    </EntityCard>
  );
}
