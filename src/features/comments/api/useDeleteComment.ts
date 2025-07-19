import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteCommentParams {
  workspaceId?: string;
  projectId?: string;
  taskId: string;
  commentId: string;
}

async function deleteComment({
  workspaceId,
  projectId,
  taskId,
  commentId,
}: DeleteCommentParams): Promise<any> {
  const url =
    projectId && workspaceId
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
      : `/tasks/${taskId}/comments/${commentId}`;
  await api.delete(url);
}

export function useDeleteComment(
  workspaceId: string | undefined,
  projectId: string | undefined,
  taskId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) =>
      deleteComment({ workspaceId, projectId, taskId, commentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}