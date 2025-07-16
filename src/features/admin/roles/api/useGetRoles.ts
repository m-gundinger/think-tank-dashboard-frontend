import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getRoles(): Promise<any> {
  const { data } = await api.get("/admin/roles");
  return data;
}

export function useGetRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
}

async function getRole(roleId: string): Promise<any> {
  const { data } = await api.get(`/admin/roles/${roleId}`);
  return data;
}

export function useGetRole(roleId: string) {
  return useQuery({
    queryKey: ["role", roleId],
    queryFn: () => getRole(roleId),
    enabled: !!roleId,
  });
}
