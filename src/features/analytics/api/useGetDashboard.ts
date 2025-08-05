import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getDashboard(dashboardId: string): Promise<any> {
  const url = `dashboards/${dashboardId}`;
  const { data } = await api.get(url);
  return data;
}

export function useGetDashboard(dashboardId: string) {
  return useQuery({
    queryKey: ["dashboard", dashboardId],
    queryFn: () => getDashboard(dashboardId),
    enabled: !!dashboardId,
  });
}