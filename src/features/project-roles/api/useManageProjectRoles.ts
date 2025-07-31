import { useApiResource } from "@/hooks/useApiResource";

export function useManageProjectRoles(workspaceId: string, projectId: string) {
  const resource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/roles`,
    ["projectRoles", projectId]
  );
  return resource;
}
