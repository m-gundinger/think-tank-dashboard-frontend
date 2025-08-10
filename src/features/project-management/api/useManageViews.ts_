import { useApiResource } from "@/hooks/useApiResource";

export function useManageViews(workspaceId: string, projectId: string) {
  const resource = useApiResource(
    `workspaces/${workspaceId}/projects/${projectId}/views`,
    ["views", projectId]
  );
  return resource;
}