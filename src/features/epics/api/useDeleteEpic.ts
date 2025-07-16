import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function deleteEpic({
  workspaceId,
  projectId,
  epicId,
}: {
  workspaceId: string;
  projectId: string;
  epicId: string;
}): Promise<void> {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/epics/${epicId}`
  );
}

export function useDeleteEpic(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (epicId) => deleteEpic({ workspaceId, projectId, epicId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["epics", projectId] });
    },
  });
}
