import { useApiResource } from "@/hooks/useApiResource";
import { Goal } from "@/types";

export function useManageGoals(workspaceId: string, projectId: string) {
  const resourceUrl = `/workspaces/${workspaceId}/projects/${projectId}/goals`;
  const resourceKey = ["goals", projectId];

  const resource = useApiResource<Goal, any>(resourceUrl, resourceKey);

  return resource;
}
