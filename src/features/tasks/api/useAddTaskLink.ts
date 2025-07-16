import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddLinkParams {
  workspaceId: string;
  projectId: string;
  taskId: string;
  linkData: any;
}

async function addTaskLink({
  workspaceId,
  projectId,
  taskId,
  linkData,
}: AddLinkParams): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/links`,
    linkData
  );
  return data;
}

export function useAddTaskLink(
  workspaceId: string,
  projectId: string,
  taskId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkData: any) =>
      addTaskLink({ workspaceId, projectId, taskId, linkData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
}
