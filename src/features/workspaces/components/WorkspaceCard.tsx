import { CardContent } from "@/components/ui/card";
import { Workspace } from "@/types";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { EntityCard } from "@/components/ui/EntityCard";
import { useManageWorkspaces } from "../api/useManageWorkspaces";

interface WorkspaceCardProps {
  workspace: Workspace;
  onEdit: (workspaceId: string) => void;
}

export function WorkspaceCard({ workspace, onEdit }: WorkspaceCardProps) {
  const { useDelete } = useManageWorkspaces();
  const deleteMutation = useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete the "${workspace.name}" workspace? This will delete all associated projects and tasks.`
      )
    ) {
      deleteMutation.mutate(workspace.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(workspace.id);
  };
  return (
    <EntityCard
      title={workspace.name}
      description={workspace.description || "No description provided."}
      linkTo={`/workspaces/${workspace.id}/projects`}
      actions={
        <ActionMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
      }
    >
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Created on:{" "}
          {new Date(workspace.createdAt).toLocaleDateString("en-US")}
        </p>
      </CardContent>
    </EntityCard>
  );
}
