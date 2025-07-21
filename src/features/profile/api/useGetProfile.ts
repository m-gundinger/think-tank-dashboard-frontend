import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
async function getProfile(): Promise<any> {
  const { data } = await api.get("/users/me");
  return data;
}

export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}
