import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface DeleteParams {
  workspaceId: string;
  projectId: string;
  dashboardId: string;
}

async function deleteDashboard({
  workspaceId,
  projectId,
  dashboardId,
}: DeleteParams): Promise<void> {
  await api.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}`
  );
}

export function useDeleteDashboard(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: (dashboardId) =>
      deleteDashboard({ workspaceId, projectId, dashboardId }),
    onSuccess: () => {
      toast.success("Dashboard deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["dashboards", projectId] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete dashboard", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
