import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

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

export function useUpdateWidget() {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, UpdateWidgetParams>({
    mutationFn: updateWidget,
    onSuccess: (updatedWidget, variables) => {
      queryClient.setQueryData<any>(
        ["dashboard", variables.dashboardId],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            widgets: oldData.widgets.map((w: any) =>
              w.id === updatedWidget.id ? updatedWidget : w
            ),
          };
        }
      );
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard", variables.dashboardId],
      });
    },
  });
}
