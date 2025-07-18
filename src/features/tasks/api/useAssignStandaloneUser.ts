import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function assignStandaloneUser({
  taskId,
  userId,
}: {
  taskId: string;
  userId: string;
}): Promise<any> {
  const { data } = await api.post(`/tasks/${taskId}/assignees`, { userId });
  return data;
}

export function useAssignStandaloneUser(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => assignStandaloneUser({ taskId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
    },
  });
}
