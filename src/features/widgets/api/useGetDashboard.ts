import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface GetDashboardParams {
  workspaceId: string;
  projectId?: string;
  dashboardId: string;
}

async function getDashboard({
  workspaceId,
  projectId,
  dashboardId,
}: GetDashboardParams): Promise<any> {
  const url = projectId
    ? `/workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}`
    : `/workspaces/${workspaceId}/dashboards/${dashboardId}`;
  const { data } = await api.get(url);
  return data;
}

export function useGetDashboard(
  workspaceId: string,
  projectId: string | undefined,
  dashboardId: string
) {
  return useQuery({
    queryKey: ["dashboard", dashboardId],
    queryFn: () => getDashboard({ workspaceId, projectId, dashboardId }),
    enabled: !!workspaceId && !!dashboardId,
  });
}