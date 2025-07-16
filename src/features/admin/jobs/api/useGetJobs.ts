import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getJobs(query: any): Promise<any> {
  const { data } = await api.get("/admin/jobs", { params: query });
  return data;
}

export function useGetJobs(query: any) {
  return useQuery({
    queryKey: ["jobs", query],
    queryFn: () => getJobs(query),

    refetchInterval: 5000,
  });
}

async function getJob(jobId: string): Promise<any> {
  const { data } = await api.get(`/admin/jobs/${jobId}`);
  return data;
}

export function useGetJob(jobId: string | null) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId!),
    enabled: !!jobId,
  });
}
