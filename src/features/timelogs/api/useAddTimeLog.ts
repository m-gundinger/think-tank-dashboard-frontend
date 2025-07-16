import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (timeLogData: any) =>
      addTimeLog({ workspaceId, projectId, taskId, timeLogData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeLogs", taskId] });
    },
  });
}
