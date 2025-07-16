import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function unassignUser({
  workspaceId,
  projectId,
  taskId,
  userId,
}: any): Promise<any> {
  const { data } = await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/assignees/${userId}`
  );
  return data;
}

export function useUnassignUser(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      unassignUser({ workspaceId, projectId, taskId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}
