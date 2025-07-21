import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface UpdateWidgetParams {
  workspaceId: string;
  projectId: string;
  dashboardId: string;
  widgetId: string;
  widgetData: any;
}

async function updateWidget(params: UpdateWidgetParams): Promise<any> {
  const { workspaceId, projectId, dashboardId, widgetId, widgetData } = params;
  const { data } = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}/widgets/${widgetId}`,
    widgetData
  );
  return data;
}

export function useUpdateWidget(
  workspaceId: string,
  projectId: string,
  dashboardId: string
) {
  return useApiMutation({
    mutationFn: (params: { widgetId: string; widgetData: any }) =>
      updateWidget({ workspaceId, projectId, dashboardId, ...params }),
    invalidateQueries: [["dashboard", dashboardId]],
  });
}