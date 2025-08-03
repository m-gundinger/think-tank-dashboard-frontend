import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getMyWhiteboards(): Promise<any> {
  const { data } = await api.get("whiteboards");
  return data;
}

export function useGetMyWhiteboards() {
  return useQuery({
    queryKey: ["myWhiteboards"],
    queryFn: getMyWhiteboards,
  });
}