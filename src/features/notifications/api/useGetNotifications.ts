import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
async function getNotifications(query?: { limit?: number }): Promise<any> {
  const { data } = await api.get("/notifications", { params: query });
  return data;
}

export function useGetNotifications(limit = 10) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications({ limit }),
  });
}
