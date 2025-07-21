import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
async function addTimeLog({
  workspaceId,
  projectId,
  taskId,
  timeLogData,
}: any): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/timelogs`,
    timeLogData
  );
  return data;
}

export function useAddTimeLog(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  return useApiMutation({
    mutationFn: (timeLogData: any) =>
      addTimeLog({ workspaceId, projectId, taskId, timeLogData }),
    successMessage: "Time logged successfully.",
    invalidateQueries: [["timeLogs", taskId]],
  });
}
