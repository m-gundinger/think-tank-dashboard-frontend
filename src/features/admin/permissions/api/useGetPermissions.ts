import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getPermissions(query: any): Promise<any> {
  const { data } = await api.get("/admin/permissions", { params: query });
  return data;
}

export function useGetPermissions(query: any) {
  return useQuery({
    queryKey: ["permissions", query],
    queryFn: () => getPermissions(query),
  });
}

async function getPermission(id: string): Promise<any> {
  const { data } = await api.get(`/admin/permissions/${id}`);
  return data;
}

export function useGetPermission(id: string | null) {
  return useQuery<any>({
    queryKey: ["permission", id],
    queryFn: () => getPermission(id!),
    enabled: !!id,
  });
}
