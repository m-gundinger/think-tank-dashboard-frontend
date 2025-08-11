import { EntityCard } from "@/components/shared/EntityCard";
import { useManageKnowledgeBases } from "../api/useManageKnowledgeBases";
import { BookOpen } from "lucide-react";
import { ActionMenu } from "@/components/shared/ActionMenu";

interface KnowledgeBaseCardProps {
  knowledgeBase: any;
  onEdit: () => void;
}

export function KnowledgeBaseCard({
  knowledgeBase,
  onEdit,
}: KnowledgeBaseCardProps) {
  const { useDelete } = useManageKnowledgeBases();
  const deleteMutation = useDelete();
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    e.stopPropagation();
    e.preventDefault();
    onEdit();
  };
  return (
    <EntityCard
      title={knowledgeBase.name}
      description={knowledgeBase.description || "No description."}
      linkTo={`/workspaces/${knowledgeBase.workspaceId}/knowledge-bases/${knowledgeBase.id}`}
      icon={BookOpen}
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