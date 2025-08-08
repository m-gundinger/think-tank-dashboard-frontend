import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Task } from "@/types";
import { useQueryClient, QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";

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

const updateTaskInTree = (
  tasks: Task[],
  taskId: string,
  updates: Partial<Task>
): Task[] => {
  if (!tasks) return [];
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

type UpdateTaskContext = {
  previousData: Map<QueryKey, any>;
};
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useApiMutation<Task, UpdateTaskParams, UpdateTaskContext>({
    mutationFn: updateTask,
    onMutate: async (variables) => {
      const { taskId, taskData, projectId } = variables;

      const queryKeysToCancel: QueryKey[] = [
        ["task", taskId],
        ["myTasks"],
        ["tasks"],
      ];
      if (projectId) {
        queryKeysToCancel.push(["projects", projectId, "tasks"]);
      }

      await Promise.all(
        queryKeysToCancel.map((key) =>
          queryClient.cancelQueries({ queryKey: key, exact: false })
        )
      );

      const previousData = new Map<QueryKey, any>();

      // Optimistically update the single task query
      const singleTaskQueryKey: QueryKey = ["task", taskId];
      const previousTask = queryClient.getQueryData<Task>(singleTaskQueryKey);
      if (previousTask) {
        previousData.set(singleTaskQueryKey, previousTask);
        queryClient.setQueryData<Task>(singleTaskQueryKey, {
          ...previousTask,
          ...taskData,
        });
      }

      // Optimistically update all list queries
      const queryCache = queryClient.getQueryCache();
      const listQueryKeys: QueryKey[] = [["myTasks"], ["tasks"]];
      if (projectId) {
        listQueryKeys.push(["projects", projectId, "tasks"]);
      }

      for (const key of listQueryKeys) {
        const queries = queryCache.findAll({ queryKey: key, exact: false });
        for (const query of queries) {
          const oldData = query.state.data as any;
          if (oldData?.pages) {
            // Handle paginated/infinite queries
            previousData.set(query.queryKey, oldData);
            const updatedPages = oldData.pages.map((page: any) => ({
              ...page,
              data: updateTaskInTree(page.data, taskId, taskData),
            }));
            queryClient.setQueryData(query.queryKey, {
              ...oldData,
              pages: updatedPages,
            });
          } else if (oldData?.data) {
            // Handle regular list queries
            previousData.set(query.queryKey, oldData);
            const updatedListData = {
              ...oldData,
              data: updateTaskInTree(oldData.data, taskId, taskData),
            };
            queryClient.setQueryData(query.queryKey, updatedListData);
          }
        }
      }

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach((data: any, queryKey: QueryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
        toast.error("Failed to update task. Reverting changes.");
      }
    },
    onSettled: (_data, _error, variables) => {
      // Invalidate all relevant queries to ensure freshness after mutation is complete
      const { taskId, projectId } = variables;
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ["projects", projectId, "tasks"],
          exact: false, // Invalidate all queries starting with this, including views
        });
        queryClient.invalidateQueries({
          queryKey: ["tasks", projectId],
          exact: false,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["myTasks"], exact: false });
    },
  });
}

interface SetTaskParentParams {
  taskId: string;
  workspaceId?: string | null;
  projectId?: string | null;
  parentId: string | null;
}

async function setTaskParent({
  taskId,
  workspaceId,
  projectId,
  parentId,
}: SetTaskParentParams): Promise<Task> {
  const url =
    workspaceId && projectId
      ? `workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/set-parent`
      : `tasks/${taskId}/set-parent`;
  const { data } = await api.patch(url, { parentId });
  return data;
}

export function useSetTaskParent() {
  const queryClient = useQueryClient();

  return useApiMutation<Task, SetTaskParentParams>({
    mutationFn: setTaskParent,
    onSuccess: (updatedTask) => {
      // Invalidate the old parent if there was one
      // The query for the new parent will be covered by the general invalidations below
      const originalTask = queryClient.getQueryData<Task>([
        "task",
        updatedTask.id,
      ]);
      if (originalTask?.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["task", originalTask.parentId],
        });
      }

      // Invalidate the task itself, its new parent, and relevant lists
      queryClient.invalidateQueries({ queryKey: ["task", updatedTask.id] });
      if (updatedTask.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["task", updatedTask.parentId],
        });
      }
      if (updatedTask.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["tasks", updatedTask.projectId],
          exact: false,
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["myTasks"], exact: false });
      }
    },
  });
}