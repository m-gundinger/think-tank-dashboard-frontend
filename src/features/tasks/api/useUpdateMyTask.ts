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
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
      : `/tasks/${taskId}`;
  const { data } = await api.put(url, taskData);
  return data;
}

type UpdateMyTaskContext = {
  previousData: Map<QueryKey, any>;
};

export function useUpdateMyTask() {
  const queryClient = useQueryClient();
  return useApiMutation<Task, UpdateMyTaskParams, UpdateMyTaskContext>({
    mutationFn: updateMyTask,
    onMutate: async (variables) => {
      const { taskId, taskData } = variables;
      const queryKeyPrefix = ["myTasks"];

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

        const updatedData = {
          ...oldData,
          data: oldData.data.map((task: Task) =>
            task.id === taskId ? { ...task, ...taskData } : task
          ),
        };
        queryClient.setQueryData(queryKey, updatedData);
      }

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
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      if (variables.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["projects", variables.projectId, "tasks"],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["task", variables.taskId] });
    },
  });
}