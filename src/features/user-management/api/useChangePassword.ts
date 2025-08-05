import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useQueryClient } from "@tanstack/react-query";

async function changePassword(passwordData: any): Promise<any> {
  const { data } = await api.post("users/me/change-password", passwordData);
  return data;
}

export function useChangePassword() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useApiMutation({
    mutationFn: changePassword,
    successMessage:
      "Password changed successfully. For your security, you have been logged out.",
    onSuccess: () => {
      queryClient.clear();
      setAccessToken(null);
      navigate("/login", { replace: true });
    },
  });
}