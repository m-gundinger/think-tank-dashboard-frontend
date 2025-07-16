import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface UpdateParams {
  workspaceId: string;
  projectId: string;
  dashboardId: string;
  dashboardData: any;
}

async function updateDashboard({
  workspaceId,
  projectId,
  dashboardId,
  dashboardData,
}: UpdateParams): Promise<any> {
  const { data } = await api.put(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboards/${dashboardId}`,
    dashboardData
  );
  return data;
}

export function useUpdateDashboard(
  workspaceId: string,
  projectId: string,
  dashboardId: string
) {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, any>({
    mutationFn: (dashboardData) =>
      updateDashboard({ workspaceId, projectId, dashboardId, dashboardData }),
    onSuccess: (updatedDashboard) => {
      toast.success("Dashboard updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["dashboards", projectId] });
      queryClient.setQueryData(["dashboard", dashboardId], updatedDashboard);
    },
    onError: (error: any) => {
      toast.error("Failed to update dashboard", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
