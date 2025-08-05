import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getProjectViews(
  workspaceId: string,
  projectId: string
): Promise<any> {
  const { data } = await api.get(
    `workspaces/${workspaceId}/projects/${projectId}/views`
  );
  return data;
}

export function useGetProjectViews(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: ["views", projectId],
    queryFn: () => getProjectViews(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId,
  });
}