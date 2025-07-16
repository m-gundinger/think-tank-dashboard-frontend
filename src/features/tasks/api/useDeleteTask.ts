import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function deleteTask({
  workspaceId,
  projectId,
  taskId,
}: any): Promise<void> {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
  );
}

export function useDeleteTask(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (taskId) => deleteTask({ workspaceId, projectId, taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}
