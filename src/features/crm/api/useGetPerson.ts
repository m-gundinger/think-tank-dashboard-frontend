import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getPerson(personId: string): Promise<any> {
  const { data } = await api.get(`/people/${personId}`);
  return data;
}

export function useGetPerson(personId: string) {
  return useQuery({
    enabled: !!personId,
    queryKey: ["person", personId],
    queryFn: () => getPerson(personId),
  });
}
