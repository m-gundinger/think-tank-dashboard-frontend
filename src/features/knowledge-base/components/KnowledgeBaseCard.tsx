import { EntityCard } from "@/components/ui/EntityCard";
import { useManageKnowledgeBase } from "../api/useManageKnowledgeBase";
import { BookOpen } from "lucide-react";

interface KnowledgeBaseCardProps {
  knowledgeBase: any;
  onEdit: () => void;
}

export function KnowledgeBaseCard({
  knowledgeBase,
  onEdit,
}: KnowledgeBaseCardProps) {
  const { useDelete } = useManageKnowledgeBase(knowledgeBase.workspaceId);
  const deleteMutation = useDelete();
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to delete "${knowledgeBase.name}"? This will delete all associated pages.`
      )
    ) {
      deleteMutation.mutate(knowledgeBase.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit();
  };
  return (
    <EntityCard
      title={knowledgeBase.name}
      description={knowledgeBase.description || "No description."}
      onEdit={handleEdit}
      onDelete={handleDelete}
      deleteDisabled={deleteMutation.isPending}
      icon={BookOpen}
    >
      <></>
    </EntityCard>
  );
}