import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

async function resetPassword(
  resetData: ResetPasswordData
): Promise<{ message: string }> {
  const { data } = await api.post("/auth/reset-password", resetData);
  return data;
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success("Password Reset Successfully", {
        description: data.message,
      });
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error("Failed to reset password", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
