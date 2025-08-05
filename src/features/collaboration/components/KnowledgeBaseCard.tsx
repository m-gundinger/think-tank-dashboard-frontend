import { EntityCard } from "@/components/ui/EntityCard";
import { useManageKnowledgeBases } from "../api/useManageKnowledgeBases";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

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
    <Link
      to={`/workspaces/${knowledgeBase.workspaceId}/knowledge-bases/${knowledgeBase.id}`}
    >
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
    </Link>
  );
}
