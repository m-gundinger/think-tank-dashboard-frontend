import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Task } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateTaskParams {
  taskId: string;
  workspaceId?: string | null;
  projectId?: string | null;
  taskData: Partial<Task>;
}

async function updateTask({
  taskId,
  workspaceId,
  projectId,
  taskData,
}: UpdateTaskParams): Promise<Task> {
  const url =
    workspaceId && projectId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
      : `tasks/${taskId}`;
  const { data } = await api.put(url, taskData);
  return data;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useApiMutation<Task, UpdateTaskParams>({
    mutationFn: updateTask,
    onSettled: (_data, _error, variables) => {
      const { taskId, projectId } = variables;
      // Invalidate all relevant queries to ensure freshness
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["myTasks"], exact: false });
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", projectId],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "tasks"],
          exact: false,
        });
      }
    },
  });
}
