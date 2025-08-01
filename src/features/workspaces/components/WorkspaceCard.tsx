import { useApiResource } from "@/hooks/useApiResource";
import { EntityCard } from "@/components/ui/EntityCard";
import { CardContent } from "@/components/ui/card";
import { Workspace } from "@/types";

interface WorkspaceCardProps {
  workspace: Workspace;
  onEdit: (workspaceId: string) => void;
}

export function WorkspaceCard({ workspace, onEdit }: WorkspaceCardProps) {
  const workspaceResource = useApiResource("workspaces", ["workspaces"]);
  const deleteMutation = workspaceResource.useDelete();
  const handleDelete = (e: React.MouseEvent) => {
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
    e.preventDefault();
    onEdit(workspace.id);
  };
  return (
    <EntityCard
      title={workspace.name}
      description={workspace.description}
      linkTo={`/workspaces/${workspace.id}/projects`}
      onEdit={handleEdit}
      onDelete={handleDelete}
      deleteDisabled={deleteMutation.isPending}
    >
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Created on:{" "}
          {new Date(workspace.createdAt).toLocaleDateString("en-US")}
        </p>
      </CardContent>
    </EntityCard>
  );
}