import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getSkills(): Promise<any[]> {
  const { data } = await api.get("/skills");
  return data;
}

export function useGetSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: getSkills,
    staleTime: Infinity,
  });
}
