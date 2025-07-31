import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Task } from "../task.types";

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
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
      : `/tasks/${taskId}`;
  const { data } = await api.put(url, taskData);
  return data;
}

export function useUpdateTask() {
  return useApiMutation<Task, UpdateTaskParams>({
    mutationFn: updateTask,
    invalidateQueries: (data) => [
      ["task", data.id],
      ["tasks", data.projectId],
      ["myTasks"],
    ],
  });
}
