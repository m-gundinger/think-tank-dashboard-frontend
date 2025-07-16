import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getJobSchedules(query: any): Promise<any> {
  const { data } = await api.get("/admin/jobs/schedules", { params: query });
  return data;
}

export function useGetJobSchedules(query: any) {
  return useQuery({
    queryKey: ["jobSchedules", query],
    queryFn: () => getJobSchedules(query),
  });
}
