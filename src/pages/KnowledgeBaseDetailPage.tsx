import { useParams } from "react-router-dom";
import { KnowledgeBaseDetailView } from "@/features/collaboration/components/KnowledgeBaseDetailView";

export function KnowledgeBaseDetailPage() {
  const { workspaceId, knowledgeBaseId } = useParams<{
    workspaceId: string;
    knowledgeBaseId: string;
  }>();

  if (!workspaceId || !knowledgeBaseId) {
    return <div>Missing ID parameters</div>;
  }

  return (
    <KnowledgeBaseDetailView
      workspaceId={workspaceId}
      knowledgeBaseId={knowledgeBaseId}
    />
  );
}