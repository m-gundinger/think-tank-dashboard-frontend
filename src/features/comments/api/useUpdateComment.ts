import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateCommentParams {
  workspaceId?: string;
  projectId?: string;
  taskId: string;
  commentId: string;
  content: string;
}

async function updateComment({
  workspaceId,
  projectId,
  taskId,
  commentId,
  content,
}: UpdateCommentParams): Promise<any> {
  const url =
    projectId && workspaceId
      ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
      : `/tasks/${taskId}/comments/${commentId}`;
  const { data } = await api.put(url, { content });
  return data;
}

export function useUpdateComment(
  workspaceId: string | undefined,
  projectId: string | undefined,
  taskId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { commentId: string; content: string }) =>
      updateComment({ workspaceId, projectId, taskId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}