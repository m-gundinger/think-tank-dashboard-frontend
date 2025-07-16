import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      toast.success("Request sent", {
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to send reset link", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
