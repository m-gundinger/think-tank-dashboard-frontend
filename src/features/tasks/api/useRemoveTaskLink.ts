import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface RemoveLinkParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
  linkId: string;
}

async function removeTaskLink({
  workspaceId,
  projectId,
  taskId,
  linkId,
}: RemoveLinkParams): Promise<any> {
  const { data } = await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/links/${linkId}`
  );
  return data;
}

export function useRemoveTaskLink(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) =>
      removeTaskLink({ workspaceId, projectId, taskId, linkId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}
