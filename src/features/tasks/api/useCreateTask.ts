import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function createTask({
  workspaceId,
  projectId,
  taskData,
}: any): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    taskData
  );
  return data;
}

export function useCreateTask(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: (taskData) => createTask({ workspaceId, projectId, taskData }),
    onSuccess: (newTask) => {
      toast.success(`Task "${newTask.title}" created.`);

      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });

      if (newTask.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["task", newTask.parentId],
        });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to create task", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
