import { useApiResource } from "@/hooks/useApiResource";

export function useManageTasks(
  workspaceId?: string | null,
  projectId?: string | null
) {
  const resourceUrl =
    workspaceId && projectId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks`
      : "tasks";
  const resourceKey = projectId ? ["tasks", projectId] : ["myTasks"];

  const resource = useApiResource(resourceUrl, resourceKey);
  return resource;
}