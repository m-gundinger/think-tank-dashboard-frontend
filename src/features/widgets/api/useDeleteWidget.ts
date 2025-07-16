import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: (widgetId) =>
      deleteWidget({ workspaceId, projectId, dashboardId, widgetId }),
    onSuccess: () => {
      toast.success("Widget removed from dashboard.");
      queryClient.invalidateQueries({ queryKey: ["dashboard", dashboardId] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete widget", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
