import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getActivities(
  workspaceId: string,
  projectId: string,
  query: any
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/activities`,
    { params: query }
  );
  return data;
}

export function useGetActivities(
  workspaceId: string,
  projectId: string,
  query: any
) {
  return useQuery({
    queryKey: ["activities", projectId, query],
    queryFn: () => getActivities(workspaceId, projectId, query),
    enabled: !!workspaceId && !!projectId,
  });
}
