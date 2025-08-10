import { getIcon } from "@/lib/icons";
import { EntityCard } from "@/components/ui/EntityCard";
import { CardContent } from "@/components/ui/card";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { useManageProjects } from "../api/useManageProjects";

interface ProjectCardProps {
  project: any;
  onEdit: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const { useDelete } = useManageProjects(project.workspaceId);
  const deleteMutation = useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete the "${project.name}" project? This action is permanent.`
      )
    ) {
      deleteMutation.mutate(project.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(project.id);
  };

  const projectUrl = `/workspaces/${project.workspaceId}/projects/${project.id}`;
  const Icon = getIcon(project.icon);

  return (
    <EntityCard
      title={project.name}
      description={project.description}
      linkTo={projectUrl}
      icon={Icon}
      actions={
        <ActionMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
      }
    >
      <CardContent>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Status: {project.status}</span>
          <span>
            Created: {new Date(project.createdAt).toLocaleDateString("en-US")}
          </span>
        </div>
      </CardContent>
    </EntityCard>
  );
}
