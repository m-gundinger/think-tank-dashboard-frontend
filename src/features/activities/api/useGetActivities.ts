import { useApiResource } from "@/hooks/useApiResource";

export function useGetActivities(workspaceId?: string, projectId?: string) {
  const resourceUrl = projectId
    ? `/workspaces/${workspaceId}/projects/${projectId}/activities`
    : workspaceId
      ? `/workspaces/${workspaceId}/activities`
      : "/activities";

  const resourceKey = projectId
    ? ["activities", projectId]
    : workspaceId
      ? ["activities", workspaceId]
      : ["activities", "global"];

  return useApiResource(resourceUrl, resourceKey);
}