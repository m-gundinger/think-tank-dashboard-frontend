import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function createTask(taskData: any): Promise<any> {
  const { data } = await api.post(`/tasks`, taskData);
  return data;
}

export function useCreateStandaloneTask() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: (taskData) => createTask(taskData),
    onSuccess: (newTask) => {
      toast.success(`Task "${newTask.title}" created.`);
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });

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