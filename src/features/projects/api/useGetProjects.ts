import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getProjects(workspaceId: string): Promise<any> {
  const { data } = await api.get(`/workspaces/${workspaceId}/projects`);
  return data;
}

export function useGetProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => getProjects(workspaceId),

    enabled: !!workspaceId,
  });
}
