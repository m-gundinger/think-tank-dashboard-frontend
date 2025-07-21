import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface DeleteTimeLogParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
  timeLogId: string;
}

async function deleteTimeLog({
  workspaceId,
  projectId,
  taskId,
  timeLogId,
}: DeleteTimeLogParams): Promise<any> {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/timelogs/${timeLogId}`
  );
}

export function useDeleteTimeLog(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return useApiMutation({
    mutationFn: (timeLogId: string) =>
      deleteTimeLog({ workspaceId, projectId, taskId, timeLogId }),
    successMessage: "Time log deleted.",
    invalidateQueries: [["timeLogs", taskId]],
  });
}
