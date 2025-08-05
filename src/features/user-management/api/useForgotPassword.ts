import api from "@/lib/api";
import { useApiMutation } from "@/hooks/useApiMutation";

async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await api.post("auth/forgot-password", { email });
  return data;
}

export function useForgotPassword() {
  return useApiMutation<{ message: string }, string>({
    mutationFn: forgotPassword,
    successMessage: (data) => data.message,
  });
}