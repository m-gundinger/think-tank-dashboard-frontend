import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
async function getOrganizations(query?: any): Promise<any> {
  const { data } = await api.get("organizations", { params: query });
  return data;
}

export function useGetOrganization(query?: any) {
  return useQuery({
    queryKey: ["organizations", query],
    queryFn: () => getOrganizations(query),
  });
}