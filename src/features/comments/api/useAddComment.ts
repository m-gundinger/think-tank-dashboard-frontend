import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddCommentParams {
  workspaceId?: string;
  projectId?: string;
  taskId: string;
  content: string;
}

async function addComment({
  workspaceId,
  projectId,
  taskId,
  content,
}: AddCommentParams): Promise<any> {
  const url =
    projectId && workspaceId
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`
      : `/tasks/${taskId}/comments`;
  const { data } = await api.post(url, { content });
  return data;
}

export function useAddComment(
  workspaceId: string | undefined,
  projectId: string | undefined,
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