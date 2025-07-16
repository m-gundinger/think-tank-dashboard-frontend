import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getUser(userId: string): Promise<any> {
  const { data } = await api.get(`/admin/users/${userId}`);
  return data;
}

export function useGetUser(userId: string) {
  return useQuery({
    enabled: !!userId,
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
  });
}
