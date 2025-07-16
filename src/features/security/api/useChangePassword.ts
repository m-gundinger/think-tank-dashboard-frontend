import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

async function changePassword(passwordData: any): Promise<any> {
  const { data } = await api.post("/users/me/change-password", passwordData);
  return data;
}

export function useChangePassword() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully.", {
        description:
          "For your security, you have been logged out. Please sign in again with your new password.",
      });

      queryClient.clear();

      setAccessToken(null);

      navigate("/login", { replace: true });
    },
    onError: (error: any) => {
      toast.error("Failed to change password", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
