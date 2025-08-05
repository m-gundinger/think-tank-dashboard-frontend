import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface UpdateWidgetParams {
  dashboardId: string;
  widgetId: string;
  widgetData: any;
}

async function updateWidget(params: UpdateWidgetParams): Promise<any> {
  const { dashboardId, widgetId, widgetData } = params;
  const url = `dashboards/${dashboardId}/widgets/${widgetId}`;
  const { data } = await api.put(url, widgetData);
  return data;
}

export function useUpdateWidget(dashboardId: string) {
  return useApiMutation({
    mutationFn: (params: { widgetId: string; widgetData: any }) =>
      updateWidget({ dashboardId, ...params }),
    invalidateQueries: [["dashboard", dashboardId]],
  });
}