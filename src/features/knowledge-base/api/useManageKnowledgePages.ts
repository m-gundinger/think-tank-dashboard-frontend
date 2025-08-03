import { useApiResource } from "@/hooks/useApiResource";

export function useManageKnowledgePages(
  workspaceId: string,
  knowledgeBaseId: string
) {
  const resource = useApiResource(
    `workspaces/${workspaceId}/knowledge-bases/${knowledgeBaseId}/pages`,
    ["knowledgePages", knowledgeBaseId]
  );
  return resource;
}