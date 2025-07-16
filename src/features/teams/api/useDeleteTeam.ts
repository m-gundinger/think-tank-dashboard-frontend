import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function deleteTeam({
  workspaceId,
  teamId,
}: {
  workspaceId: string;
  teamId: string;
}): Promise<void> {
  await api.delete(`/workspaces/${workspaceId}/teams/${teamId}`);
}

export function useDeleteTeam(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: (teamId) => deleteTeam({ workspaceId, teamId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", workspaceId] });
    },
  });
}
