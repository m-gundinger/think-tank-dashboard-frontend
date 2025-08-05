import { useApiResource } from "@/hooks/useApiResource";

export function useManageKnowledgePages(knowledgeBaseId: string) {
  const resource = useApiResource(`knowledge-bases/${knowledgeBaseId}/pages`, [
    "knowledgePages",
    knowledgeBaseId,
  ]);
  return resource;
}