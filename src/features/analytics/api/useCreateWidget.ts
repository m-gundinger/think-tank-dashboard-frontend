import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface CreateWidgetParams {
  dashboardId: string;
  widgetData: any;
}

async function createWidget({
  dashboardId,
  widgetData,
}: CreateWidgetParams): Promise<any> {
  const url = `dashboards/${dashboardId}/widgets`;
  const { data } = await api.post(url, widgetData);
  return data;
}

export function useCreateWidget(dashboardId: string) {
  return useApiMutation({
    mutationFn: (widgetData: any) => createWidget({ dashboardId, widgetData }),
    successMessage: "Widget added to dashboard.",
    invalidateQueries: [["dashboard", dashboardId]],
  });
}