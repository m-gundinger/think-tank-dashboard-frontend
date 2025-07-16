import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function updateTask({
  workspaceId,
  projectId,
  taskId,
  taskData,
}: any): Promise<any> {
  const { data } = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    taskData
  );
  return data;
}

export function useUpdateTask(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, any>({
    mutationFn: (taskData) =>
      updateTask({ workspaceId, projectId, taskId, taskData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}
