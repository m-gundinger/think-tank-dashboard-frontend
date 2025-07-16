import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getPeople(query: any): Promise<any> {
  const { data } = await api.get("/people", { params: query });
  return data;
}

export function useGetPeople(query: any) {
  return useQuery({
    queryKey: ["people", query],
    queryFn: () => getPeople(query),
  });
}
