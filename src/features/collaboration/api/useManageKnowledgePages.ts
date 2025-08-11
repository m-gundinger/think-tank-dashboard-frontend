import { useApiResource } from "@/hooks/useApiResource";
import { KnowledgePage } from "@/types";

export function useManageKnowledgePages(knowledgeBaseId: string) {
  const resource = useApiResource<KnowledgePage>(
    `knowledge-bases/${knowledgeBaseId}/pages`,
    ["knowledgePages", knowledgeBaseId]
  );
  return resource;
}