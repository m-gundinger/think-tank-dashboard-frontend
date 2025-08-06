import { EntityCard } from "@/components/ui/EntityCard";
import { useManageProjectTemplates } from "../api/useManageProjectTemplates";
import { FileText } from "lucide-react";

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
      onEdit={handleEdit}
      onDelete={handleDelete}
      deleteDisabled={deleteMutation.isPending}
      icon={FileText}
    >
      <div className="text-muted-foreground text-sm">
        Created on: {new Date(template.createdAt).toLocaleDateString("en-US")}
      </div>
    </EntityCard>
  );
}