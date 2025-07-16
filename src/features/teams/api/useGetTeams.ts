import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getTeams(workspaceId: string, query?: any): Promise<any> {
  const { data } = await api.get(`/workspaces/${workspaceId}/teams`, {
    params: query,
  });
  return data;
}

export function useGetTeams(workspaceId: string, query?: any) {
  return useQuery({
    queryKey: ["teams", workspaceId, query],
    queryFn: () => getTeams(workspaceId, query),
    enabled: !!workspaceId,
  });
}

async function getTeam(workspaceId: string, teamId: string): Promise<any> {
  const { data } = await api.get(`/workspaces/${workspaceId}/teams/${teamId}`);
  return data;
}

export function useGetTeam(workspaceId: string, teamId: string | null) {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getTeam(workspaceId, teamId!),
    enabled: !!workspaceId && !!teamId,
  });
}
