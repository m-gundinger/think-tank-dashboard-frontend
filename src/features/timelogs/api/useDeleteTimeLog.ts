import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (timeLogId: string) =>
      deleteTimeLog({ workspaceId, projectId, taskId, timeLogId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeLogs", taskId] });
    },
  });
}
