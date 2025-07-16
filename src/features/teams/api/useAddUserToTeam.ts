import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function addUserToTeam({
  workspaceId,
  teamId,
  userId,
}: any): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/teams/${teamId}/members/${userId}`
  );
  return data;
}

export function useAddUserToTeam(workspaceId: string, teamId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      addUserToTeam({ workspaceId, teamId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
    },
  });
}
