import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getWorkspace(workspaceId: string): Promise<any> {
  const { data } = await api.get(`/workspaces/${workspaceId}`);
  return data;
}

export function useGetWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspace(workspaceId),
    enabled: !!workspaceId,
  });
}
