import { useApiResource } from "@/hooks/useApiResource";

export function useManageTaskTypes(workspaceId?: string, projectId?: string) {
  // Project-specific task types
  if (workspaceId && projectId) {
    const resource = useApiResource(
      `workspaces/${workspaceId}/projects/${projectId}/task-types`,
      ["taskTypes", projectId]
    );
    return resource;
  }
  // Global task types (for standalone tasks)
  const resource = useApiResource("task-types", ["taskTypes", "global"]);
  return resource;
}