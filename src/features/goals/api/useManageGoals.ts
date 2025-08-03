import { useApiResource } from "@/hooks/useApiResource";
export function useManageGoals(workspaceId?: string, projectId?: string) {
  const resourceUrl =
    workspaceId && projectId
      ? `workspaces/${workspaceId}/projects/${projectId}/goals`
      : "goals";

  const resourceKey = projectId ? ["goals", projectId] : ["goals"];

  const resource = useApiResource(resourceUrl, resourceKey);
  return resource;
}
