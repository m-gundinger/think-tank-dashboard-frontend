import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function unassignStandaloneUser({
  taskId,
  userId,
}: {
  taskId: string;
  userId: string;
}): Promise<void> {
  await api.delete(`/tasks/${taskId}/assignees/${userId}`);
}

export function useUnassignStandaloneUser(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => unassignStandaloneUser({ taskId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["myTasks"] });
    },
  });
}
