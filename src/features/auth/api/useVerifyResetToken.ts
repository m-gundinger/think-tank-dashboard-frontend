import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
async function verifyResetToken(token: string): Promise<{ message: string }> {
  const { data } = await api.get(`/auth/reset-password/${token}`);
  return data;
}

export function useVerifyResetToken(token: string | null) {
  return useQuery({
    queryKey: ["verifyResetToken", token],
    queryFn: () => verifyResetToken(token!),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
