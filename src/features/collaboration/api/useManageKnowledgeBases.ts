import { useApiResource } from "@/hooks/useApiResource";
import { KnowledgeBase } from "@/types";

interface KnowledgeBaseQuery {
  page?: number;
  limit?: number;
  search?: string;
  workspaceId?: string;
}

export function useManageKnowledgeBases() {
  const resource = useApiResource<KnowledgeBase, KnowledgeBaseQuery>(
    "knowledge-bases",
    ["knowledgeBases"]
  );
  return resource;
}