import { useApiResource } from "@/hooks/useApiResource";

export function useManageTimeLogs(
  workspaceId: string | undefined,
  projectId: string | undefined,
  taskId: string
) {
  const resourceUrl =
    workspaceId && projectId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/timelogs`
      : `standalone-tasks/${taskId}/timelogs`;

  const resourceKey = ["timeLogs", taskId];

  return useApiResource(resourceUrl, resourceKey);
}
