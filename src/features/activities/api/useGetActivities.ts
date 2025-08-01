import { useApiResource } from "@/hooks/useApiResource";

export function useGetActivities(workspaceId?: string, projectId?: string) {
  const resourceUrl =
    workspaceId && projectId
      ? `/workspaces/${workspaceId}/projects/${projectId}/activities`
      : "/activities";

  const resourceKey =
    workspaceId && projectId
      ? ["activities", projectId]
      : ["activities", "global"];

  return useApiResource(resourceUrl, resourceKey);
}
