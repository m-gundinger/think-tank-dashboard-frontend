import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getDashboards(
  workspaceId: string,
  projectId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboards`
  );
  return data;
}

export function useGetDashboards(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: ["dashboards", projectId],
    queryFn: () => getDashboards(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId,
  });
}
