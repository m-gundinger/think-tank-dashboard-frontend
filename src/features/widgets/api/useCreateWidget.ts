import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateWidgetParams {
  workspaceId: string;
  projectId: string;
  dashboardId: string;
  widgetData: any;
}

async function createWidget({
  workspaceId,
  projectId,
  dashboardId,
  widgetData,
}: CreateWidgetParams): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}/widgets`,
    widgetData
  );
  return data;
}

export function useCreateWidget(
  workspaceId: string,
  projectId: string,
  dashboardId: string
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (widgetData: any) =>
      createWidget({ workspaceId, projectId, dashboardId, widgetData }),
    onSuccess: (newWidget) => {
      queryClient.setQueryData<any>(
        ["dashboard", dashboardId],
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            widgets: [...oldData.widgets, newWidget],
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", dashboardId] });
    },
  });
}
