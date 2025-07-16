import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

async function createTeam({ workspaceId, teamData }: any): Promise<any> {
  const { data } = await api.post(`/workspaces/${workspaceId}/teams`, teamData);
  return data;
}

export function useCreateTeam(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, AxiosError, any>({
    mutationFn: (teamData) => createTeam({ workspaceId, teamData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams", workspaceId] });
    },
  });
}
