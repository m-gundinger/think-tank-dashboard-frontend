import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getWorkspaces(): Promise<any> {
  const { data } = await api.get("/workspaces");
  return data;
}

export function useGetWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });
}
