import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function removeUserFromTeam({
  workspaceId,
  teamId,
  userId,
}: any): Promise<any> {
  const { data } = await api.delete(
    `/workspaces/${workspaceId}/teams/${teamId}/members/${userId}`
  );
  return data;
}

export function useRemoveUserFromTeam(workspaceId: string, teamId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      removeUserFromTeam({ workspaceId, teamId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
    },
  });
}
