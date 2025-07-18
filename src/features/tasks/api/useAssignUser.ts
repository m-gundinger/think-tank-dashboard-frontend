import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function assignUser({
  workspaceId,
  projectId,
  taskId,
  userId,
}: any): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/assignees`,
    { userId }
  );
  return data;
}

export function useAssignUser(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      assignUser({ workspaceId, projectId, taskId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}
