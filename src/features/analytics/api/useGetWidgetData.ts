import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getWidgetData({ dashboardId, widgetId }: any): Promise<any> {
  const url = `dashboards/${dashboardId}/widgets/${widgetId}/data`;
  const { data } = await api.get(url);
  return data;
}

export function useGetWidgetData(dashboardId: string, widgetId: string) {
  return useQuery({
    queryKey: ["widgetData", widgetId],
    queryFn: () => getWidgetData({ dashboardId, widgetId }),
    enabled: !!dashboardId && !!widgetId,
  });
}