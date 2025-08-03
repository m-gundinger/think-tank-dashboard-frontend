import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "@/hooks/useApiMutation";
interface ResetPasswordData {
  token: string;
  newPassword: string;
}

async function resetPassword(
  resetData: ResetPasswordData
): Promise<{ message: string }> {
  const { data } = await api.post("auth/reset-password", resetData);
  return data;
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useApiMutation({
    mutationFn: resetPassword,
    successMessage: (data) => data.message,
    onSuccess: () => {
      navigate("/login");
    },
  });
}