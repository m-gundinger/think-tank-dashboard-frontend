import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skill } from "@/types";

async function getSkills(): Promise<Skill[]> {
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