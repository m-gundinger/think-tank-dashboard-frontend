import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getWidgetData({
  workspaceId,
  projectId,
  dashboardId,
  widgetId,
}: any): Promise<any> {
  const url = projectId
    ? `workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}/widgets/${widgetId}/data`
    : `workspaces/${workspaceId}/dashboards/${dashboardId}/widgets/${widgetId}/data`;
  const { data } = await api.get(url);
  return data;
}

export function useGetWidgetData(
  workspaceId: string,
  projectId: string | undefined,
  dashboardId: string,
  widgetId: string
) {
  return useQuery({
    queryKey: ["widgetData", widgetId],
    queryFn: () =>
      getWidgetData({ workspaceId, projectId, dashboardId, widgetId }),
    enabled: !!workspaceId && !!dashboardId && !!widgetId,
  });
}