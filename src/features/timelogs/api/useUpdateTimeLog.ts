import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { timeLogId: string; timeLogData: any }) =>
      updateTimeLog({ workspaceId, projectId, taskId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeLogs", taskId] });
    },
  });
}
