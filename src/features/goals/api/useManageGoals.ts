import { useApiResource } from "@/hooks/useApiResource";

export function useManageGoals(workspaceId: string, projectId: string) {
  const resource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/goals`,
    ["goals", projectId]
  );
  return resource;
}
