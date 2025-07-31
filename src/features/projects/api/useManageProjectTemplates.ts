import { useApiResource } from "@/hooks/useApiResource";

export function useManageProjectTemplates(
  workspaceId: string,
  projectId: string
) {
  const resource = useApiResource(
    `/workspaces/${workspaceId}/projects/${projectId}/templates`,
    ["projectTemplates", projectId]
  );
  return resource;
}
