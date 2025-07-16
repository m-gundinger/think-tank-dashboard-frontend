import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getUsers(query: any): Promise<any> {
  const { data } = await api.get("/admin/users", { params: query });
  return data;
}

export function useGetUsers(query: any) {
  return useQuery({
    queryKey: ["users", query],
    queryFn: () => getUsers(query),
  });
}
