import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdateParams {
  workspaceId: string;
  teamId: string;
  teamData: any;
}

async function updateTeam({
  workspaceId,
  teamId,
  teamData,
}: UpdateParams): Promise<any> {
  const { data } = await api.put(
    `/workspaces/${workspaceId}/teams/${teamId}`,
    teamData
  );
  return data;
}

export function useUpdateTeam(workspaceId: string, teamId: string) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: (teamData) => updateTeam({ workspaceId, teamId, teamData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["team", teamId] });
    },
  });
}
