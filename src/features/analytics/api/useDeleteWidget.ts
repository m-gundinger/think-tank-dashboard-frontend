import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface DeleteParams {
  dashboardId: string;
  widgetId: string;
}

async function deleteWidget({
  dashboardId,
  widgetId,
}: DeleteParams): Promise<void> {
  const url = `dashboards/${dashboardId}/widgets/${widgetId}`;
  await api.delete(url);
}

export function useDeleteWidget(dashboardId: string) {
  return useApiMutation<void, string>({
    mutationFn: (widgetId) => deleteWidget({ dashboardId, widgetId }),
    successMessage: "Widget removed from dashboard.",
    invalidateQueries: [["dashboard", dashboardId]],
  });
}