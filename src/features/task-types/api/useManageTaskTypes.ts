import { useApiResource } from "@/hooks/useApiResource";
export function useManageTaskTypes(workspaceId: string, projectId: string) {
  const resource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/task-types`,
    ["taskTypes", projectId]
  );
  return resource;
}