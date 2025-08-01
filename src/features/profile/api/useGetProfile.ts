import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
async function getProfile(): Promise<User> {
  const { data } = await api.get("/users/me");
  return data;
}

export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
}