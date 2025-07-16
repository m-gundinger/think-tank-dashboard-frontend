import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface RemoveMemberParams {
  workspaceId: string;
  projectId: string;
  userId: string;
}

async function removeProjectMember(params: RemoveMemberParams): Promise<void> {
  const { workspaceId, projectId, userId } = params;
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/members/${userId}`
  );
}

export function useRemoveProjectMember(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: (userId) =>
      removeProjectMember({ workspaceId, projectId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectMembers", projectId],
      });
    },
  });
}
