import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
async function getCompanies(query?: any): Promise<any> {
  const { data } = await api.get("/companies", { params: query });
  return data;
}

export function useGetCompanies(query?: any) {
  return useQuery({
    queryKey: ["companies", query],
    queryFn: () => getCompanies(query),
  });
}