import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getJobSystemStatus(): Promise<any> {
  const { data } = await api.get("/admin/jobs/system/status");
  return data;
}

export function useGetJobSystemStatus() {
  return useQuery({
    queryKey: ["jobSystemStatus"],
    queryFn: getJobSystemStatus,
    refetchInterval: 5000,
  });
}

async function getQueueStats(): Promise<any> {
  const { data } = await api.get("/admin/jobs/system/queue-stats");
  return data;
}

export function useGetQueueStats() {
  return useQuery({
    queryKey: ["queueStats"],
    queryFn: getQueueStats,
    refetchInterval: 5000,
  });
}
