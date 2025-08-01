import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getMyWhiteboards(): Promise<any> {
  // Assuming a global endpoint like this exists
  const { data } = await api.get("/views/my-whiteboards");
  return data;
}

export function useGetMyWhiteboards() {
  return useQuery({
    queryKey: ["myWhiteboards"],
    queryFn: getMyWhiteboards,
  });
}
