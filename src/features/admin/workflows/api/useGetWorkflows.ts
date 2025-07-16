import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getWorkflows(): Promise<any> {
  const { data } = await api.get("/admin/workflows");
  return data;
}

export function useGetWorkflows() {
  return useQuery<any>({
    queryKey: ["workflows"],
    queryFn: getWorkflows,
  });
}
