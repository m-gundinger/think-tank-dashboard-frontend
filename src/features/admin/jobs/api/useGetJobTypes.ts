import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getJobTypes(): Promise<any> {
  const { data } = await api.get("admin/jobs/system/job-types");
  return data;
}

export function useGetJobTypes() {
  return useQuery({
    queryKey: ["jobTypes"],
    queryFn: getJobTypes,
    staleTime: Infinity,
  });
}