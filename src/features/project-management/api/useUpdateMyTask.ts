import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Task } from "@/types";
import { useQueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateMyTaskParams {
  taskId: string;
  workspaceId?: string | null;
  projectId?: string | null;
  taskData: Partial<Task>;
}

async function updateMyTask({
  taskId,
  workspaceId,
  projectId,
  taskData,
}: UpdateMyTaskParams): Promise<Task> {
  const url =
    workspaceId && projectId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
      : `tasks/${taskId}`;
  const { data } = await api.put(url, taskData);
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

type UpdateMyTaskContext = {
  previousData: Map<QueryKey, any>;
};

export function useUpdateMyTask() {
  const queryClient = useQueryClient();
  return useApiMutation<Task, UpdateMyTaskParams, UpdateMyTaskContext>({
    mutationFn: updateMyTask,
    onMutate: async (variables) => {
      const { taskId, taskData } = variables;
      await queryClient.cancelQueries({ queryKey: ["myTasks"] });
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      await queryClient.cancelQueries({ queryKey: ["task", taskId] });

      const previousData = new Map<QueryKey, any>();

      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["myTasks"], exact: false });
      queries.push(
        ...queryClient
          .getQueryCache()
          .findAll({ queryKey: ["tasks"], exact: false })
      );

      queries.forEach((query) => {
        const oldData = query.state.data as any;
        if (oldData?.data) {
          previousData.set(query.queryKey, oldData);
          const updatedData = {
            ...oldData,
            data: updateTaskInTree(oldData.data, taskId, taskData),
          };
          queryClient.setQueryData(query.queryKey, updatedData);
        }
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
        toast.error("Failed to update task. Reverting changes.");
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myTasks"], exact: false });
      if (variables.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", variables.projectId],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ["projects", variables.projectId, "tasks"],
          exact: false,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
    },
  });
}