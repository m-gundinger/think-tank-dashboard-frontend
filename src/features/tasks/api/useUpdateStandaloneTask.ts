import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function updateTask({
  taskId,
  taskData,
}: {
  taskId: string;
  taskData: any;
}): Promise<any> {
  const { data } = await api.put(`/tasks/${taskId}`, taskData);
  return data;
}

export function useUpdateStandaloneTask(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: (taskData) => updateTask({ taskId, taskData }),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
      queryClient.setQueryData(["task", taskId], updatedTask);
    },
  });
}
