import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getSystemStatus(): Promise<any> {
  const { data } = await api.get("/status");
  return data;
}

export function useGetSystemStatus() {
  return useQuery({
    queryKey: ["systemStatus"],
    queryFn: getSystemStatus,

    refetchInterval: 15000,
  });
}
