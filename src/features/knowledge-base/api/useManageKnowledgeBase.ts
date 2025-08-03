import { useApiResource } from "@/hooks/useApiResource";
export function useManageKnowledgeBase(workspaceId: string) {
  const resource = useApiResource(`workspaces/${workspaceId}/knowledge-bases`, [
    "knowledgeBases",
    workspaceId,
  ]);
  return resource;
}