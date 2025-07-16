import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteCommentParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
  commentId: string;
}

async function deleteComment({
  workspaceId,
  projectId,
  taskId,
  commentId,
}: DeleteCommentParams): Promise<any> {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
  );
}

export function useDeleteComment(
  workspaceId: string,
  projectId: string,
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
