import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

interface DeleteParams {
  workspaceId: string;
  projectId: string;
  dashboardId: string;
  widgetId: string;
}

async function deleteWidget({
  workspaceId,
  projectId,
  dashboardId,
  widgetId,
}: DeleteParams): Promise<void> {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}/widgets/${widgetId}`
  );
}

export function useDeleteWidget(
  workspaceId: string,
  projectId: string,
  dashboardId: string
) {
  return useApiMutation<void, string>({
    mutationFn: (widgetId) =>
      deleteWidget({ workspaceId, projectId, dashboardId, widgetId }),
    successMessage: "Widget removed from dashboard.",
    invalidateQueries: [["dashboard", dashboardId]],
  });
}