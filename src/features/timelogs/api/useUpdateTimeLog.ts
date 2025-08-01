import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface UpdateTimeLogParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
  timeLogId: string;
  timeLogData: any;
}

async function updateTimeLog({
  workspaceId,
  projectId,
  taskId,
  timeLogId,
  timeLogData,
}: UpdateTimeLogParams): Promise<any> {
  const { data } = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/timelogs/${timeLogId}`,
    timeLogData
  );
  return data;
}

export function useUpdateTimeLog(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return useApiMutation({
    mutationFn: (data: { timeLogId: string; timeLogData: any }) =>
      updateTimeLog({ workspaceId, projectId, taskId, ...data }),
    successMessage: "Time log updated.",
    invalidateQueries: [["timeLogs", taskId]],
  });
}