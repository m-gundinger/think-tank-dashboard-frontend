import { useApiResource } from "@/hooks/useApiResource";
import { getIcon } from "@/lib/icons";
import { EntityCard } from "@/components/ui/EntityCard";
import { CardContent } from "@/components/ui/card";

interface ProjectCardProps {
  project: any;
  onEdit: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const projectResource = useApiResource(
    `/workspaces/${project.workspaceId}/projects`,
    ["projects", project.workspaceId]
  );
  const deleteMutation = projectResource.useDelete();

  const handleDelete = (e: React.MouseEvent) => {
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
      onEdit={handleEdit}
      onDelete={handleDelete}
      deleteDisabled={deleteMutation.isPending}
      icon={Icon}
    >
      <CardContent>
        <div className="text-muted-foreground flex justify-between text-sm">
          <span>Status: {project.status}</span>
          <span>
            Created: {new Date(project.createdAt).toLocaleDateString("en-US")}
          </span>
        </div>
      </CardContent>
    </EntityCard>
  );
}
