import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createDashboard({
  workspaceId,
  projectId,
  dashboardData,
}: any): Promise<any> {
  const { data } = await api.post(
    `/workspaces/${workspaceId}/projects/${projectId}/dashboards`,
    dashboardData
  );
  return data;
}

export function useCreateDashboard(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dashboardData: any) =>
      createDashboard({ workspaceId, projectId, dashboardData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards", projectId] });
    },
  });
}
