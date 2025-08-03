import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface CreateWidgetParams {
  workspaceId: string;
  projectId?: string;
  dashboardId: string;
  widgetData: any;
}

async function createWidget({
  workspaceId,
  projectId,
  dashboardId,
  widgetData,
}: CreateWidgetParams): Promise<any> {
  const url = projectId
    ? `workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}/widgets`
    : `workspaces/${workspaceId}/dashboards/${dashboardId}/widgets`;

  const { data } = await api.post(url, widgetData);
  return data;
}

export function useCreateWidget(
  workspaceId: string,
  projectId: string | undefined,
  dashboardId: string
) {
  return useApiMutation({
    mutationFn: (widgetData: any) =>
      createWidget({ workspaceId, projectId, dashboardId, widgetData }),
    successMessage: "Widget added to dashboard.",
    invalidateQueries: [["dashboard", dashboardId]],
  });
}