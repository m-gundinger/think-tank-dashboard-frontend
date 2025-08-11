import { EntityCard } from "@/components/shared/EntityCard";
import { useManageProjectTemplates } from "../api/useManageProjectTemplates";
import { FileText } from "lucide-react";
import { ActionMenu } from "@/components/shared/ActionMenu";

interface ProjectTemplateCardProps {
  template: any;
  onEdit: () => void;
}

export function ProjectTemplateCard({
  template,
  onEdit,
}: ProjectTemplateCardProps) {
  const { useDelete } = useManageProjectTemplates();
  const deleteMutation = useDelete();
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete the "${template.name}" template?`
      )
    ) {
      deleteMutation.mutate(template.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit();
  };
  return (
    <EntityCard
      title={template.name}
      description={template.description || "No description provided."}
      icon={FileText}
      actions={
        <ActionMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
      }
    >
      <div className="text-sm text-muted-foreground">
        Created on: {new Date(template.createdAt).toLocaleDateString("en-US")}
      </div>
    </EntityCard>
  );
}