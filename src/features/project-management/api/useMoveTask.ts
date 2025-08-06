import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { TaskStatus } from "@/types/api";
import { Task } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

interface MoveTaskParams {
  workspaceId?: string | null;
  projectId?: string | null;
  taskId: string;
  targetColumnId: string;
  orderInColumn: number;
  newStatus: TaskStatus | null;
}

async function moveTask(params: MoveTaskParams): Promise<Task> {
  const { workspaceId, projectId, taskId, targetColumnId, orderInColumn } =
    params;
  const url =
    workspaceId && projectId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/move`
      : `tasks/${taskId}/move`; // Fallback might need review depending on standalone task move logic

  const { data } = await api.patch(url, { targetColumnId, orderInColumn });
  return data;
}

export function useMoveTask(projectId?: string | null) {
  const queryClient = useQueryClient();

  return useApiMutation<Task, MoveTaskParams>({
    mutationFn: moveTask,
    // No success message to keep the UI quiet during DnD
    onSuccess: (movedTask) => {
      // Invalidate queries to refetch and align state from server
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "tasks"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["task", movedTask.id],
        exact: false,
      });
      if (movedTask.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["task", movedTask.parentId],
          exact: false,
        });
      }
    },
    // Error handling can be enhanced if needed, e.g., reverting optimistic updates
  });
}