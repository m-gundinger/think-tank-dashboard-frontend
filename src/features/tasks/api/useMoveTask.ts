// src/features/tasks/api/useMoveTask.ts
import api from "@/lib/api";
import { useMutation, useQueryClient, QueryKey } from "@tanstack/react-query";
import { TaskStatus } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Task } from "../task.types";

interface MoveTaskParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
  targetColumnId: string;
  orderInColumn: number;
  newStatus: TaskStatus | null;
}

async function moveTask(params: MoveTaskParams): Promise<any> {
  const { workspaceId, projectId, taskId, targetColumnId, orderInColumn } =
    params;
  const { data } = await api.patch(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/move`,
    { targetColumnId, orderInColumn }
  );
  return data;
}

const updateTaskInTree = (
  tasks: Task[],
  taskId: string,
  updates: Partial<Task>
): Task[] => {
  return tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, ...updates };
    }
    if (task.subtasks && task.subtasks.length > 0) {
      return {
        ...task,
        subtasks: updateTaskInTree(task.subtasks, taskId, updates),
      };
    }
    return task;
  });
};

type MoveTaskContext =
  | {
      previousData: Map<QueryKey, any>;
    }
  | undefined;

export function useMoveTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, AxiosError, MoveTaskParams, MoveTaskContext>({
    mutationFn: moveTask,
    onMutate: async (variables) => {
      const { projectId, taskId, targetColumnId, orderInColumn, newStatus } =
        variables;
      const queryKeyPrefix = ["projects", projectId, "tasks", "view"];

      await queryClient.cancelQueries({
        queryKey: queryKeyPrefix,
        exact: false,
      });

      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: queryKeyPrefix });

      const previousData = new Map<QueryKey, any>();
      queries.forEach((query) => {
        previousData.set(query.queryKey, query.state.data);
      });

      for (const [queryKey, oldData] of previousData.entries()) {
        if (!oldData || !oldData.data) continue;

        const originalTask = oldData.data.find((t: Task) => t.id === taskId);

        const updatedData = {
          ...oldData,
          data: updateTaskInTree(oldData.data, taskId, {
            boardColumnId: targetColumnId,
            orderInColumn,
            status: newStatus ?? originalTask?.status,
          }),
        };
        queryClient.setQueryData(queryKey, updatedData);
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach((data: any, queryKey: QueryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
        toast.error("Failed to move task. Reverting changes.");
      }
    },
    onSettled: (_data, _error, variables) => {
      const queryKeyPrefix = ["projects", variables.projectId, "tasks", "view"];
      queryClient.invalidateQueries({ queryKey: queryKeyPrefix, exact: false });
    },
  });
}
