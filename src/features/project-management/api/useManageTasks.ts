import { useApiResource } from "@/hooks/useApiResource";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types";

export function useManageTasks(
  workspaceId?: string | null,
  projectId?: string | null
) {
  const queryClient = useQueryClient();

  const { resourceUrl, resourceKey } = useApiResource.constructUrlAndKey({
    scope: "tasks",
    workspaceId,
    projectId,
  });

  const resource = useApiResource(resourceUrl, resourceKey);
  const useCreate = () => {
    const createMutation = resource.useCreate();

    const mutate = (
      data: Partial<Task>,
      options?: { onSuccess?: (data: any) => void }
    ) => {
      createMutation.mutate(data, {
        onSuccess: (newData) => {
          if (data.parentId) {
            queryClient.invalidateQueries({
              queryKey: ["task", data.parentId],
            });
          }
          options?.onSuccess?.(newData);
        },
      });
    };

    return { ...createMutation, mutate };
  };

  const useDelete = () => {
    const deleteMutation = resource.useDelete();

    const mutate = (
      ids: string | string[],
      options?: { onSuccess?: () => void }
    ) => {
      const tasksToDelete: Task[] = [];
      const idArray = Array.isArray(ids) ? ids : [ids];

      idArray.forEach((id) => {
        const task = queryClient.getQueryData<Task>(["task", id]);
        if (task) {
          tasksToDelete.push(task);
        } else {
          // Fallback for list views
          const queries = queryClient.getQueryCache().findAll({
            queryKey: ["tasks"],
            exact: false,
          });
          for (const query of queries) {
            const data = query.state.data as any;
            const foundTask = data?.data?.find((t: Task) => t.id === id);
            if (foundTask) {
              tasksToDelete.push(foundTask);
              break;
            }
          }
        }
      });

      deleteMutation.mutate(ids, {
        onSuccess: () => {
          tasksToDelete.forEach((task) => {
            if (task.parentId) {
              queryClient.invalidateQueries({
                queryKey: ["task", task.parentId],
              });
            }
          });
          options?.onSuccess?.();
        },
      });
    };

    return { ...deleteMutation, mutate };
  };

  return { ...resource, useCreate, useDelete };
}