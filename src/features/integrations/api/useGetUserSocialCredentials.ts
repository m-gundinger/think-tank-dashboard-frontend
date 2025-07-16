import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

async function getSocialCredentials(): Promise<any> {
  const { data } = await api.get("/users/me/social-credentials");
  return data;
}

export function useGetUserSocialCredentials() {
  return useQuery({
    queryKey: ["social-credentials"],
    queryFn: getSocialCredentials,
  });
}
