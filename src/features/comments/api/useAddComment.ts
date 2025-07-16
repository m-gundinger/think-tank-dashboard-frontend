import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function addComment({
  workspaceId,
  projectId,
  taskId,
  content,
}: any): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`,
    { content }
  );
  return data;
}

export function useAddComment(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      addComment({ workspaceId, projectId, taskId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}
