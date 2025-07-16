import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getDashboard(
  workspaceId: string,
  projectId: string,
  dashboardId: string
): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}`
  );
  return data;
}

export function useGetDashboard(
  workspaceId: string,
  projectId: string,
  dashboardId: string
) {
  return useQuery({
    queryKey: ["dashboard", dashboardId],
    queryFn: () => getDashboard(workspaceId, projectId, dashboardId),
    enabled: !!workspaceId && !!projectId && !!dashboardId,
  });
}
