import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

async function deleteTask(taskIds: string | string[]): Promise<void> {
  if (Array.isArray(taskIds)) {
    await api.delete(`/tasks`, { data: { ids: taskIds } });
  } else {
    await api.delete(`/tasks/${taskIds}`);
  }
}

export function useDeleteStandaloneTask() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string | string[]>({
    mutationFn: deleteTask,
    onSuccess: (_, variables) => {
      const count = Array.isArray(variables) ? variables.length : 1;
      toast.success(`${count} task(s) deleted.`);
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete task(s)", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
