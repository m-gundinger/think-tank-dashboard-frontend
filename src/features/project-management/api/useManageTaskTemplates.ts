import { useApiResource } from "@/hooks/useApiResource";

export function useManageTaskTemplates(workspaceId: string, projectId: string) {
  const resource = useApiResource(
    `workspaces/${workspaceId}/projects/${projectId}/task-templates`,
    ["taskTemplates", projectId]
  );
  return resource;
}