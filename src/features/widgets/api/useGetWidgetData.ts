import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getWidgetData({
  workspaceId,
  projectId,
  dashboardId,
  widgetId,
}: any): Promise<any> {
  const { data } = await api.get(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}/widgets/${widgetId}/data`
  );
  return data;
}

export function useGetWidgetData(
  workspaceId: string,
  projectId: string,
  dashboardId: string,
  widgetId: string
) {
  return useQuery({
    queryKey: ["widgetData", widgetId],
    queryFn: () =>
      getWidgetData({ workspaceId, projectId, dashboardId, widgetId }),
    enabled: !!workspaceId && !!projectId && !!dashboardId && !!widgetId,
  });
}
