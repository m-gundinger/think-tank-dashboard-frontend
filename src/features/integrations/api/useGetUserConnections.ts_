import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// NOTE: This assumes an endpoint /users/me/connections exists to fetch
// the user's personal OAuth connections. This is a necessary addition
// to the documented API for a fully functional UI.
async function getUserConnections(): Promise<any[]> {
  const { data } = await api.get("/users/me/connections");
  return data;
}

export function useGetUserConnections() {
  return useQuery({
    queryKey: ["userConnections"],
    queryFn: getUserConnections,
  });
}
