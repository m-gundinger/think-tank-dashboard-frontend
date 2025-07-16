import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SetupPasswordData {
  token: string;
  newPassword: string;
}

async function setupPassword(
  setupData: SetupPasswordData
): Promise<{ message: string }> {
  const { data } = await api.post("/auth/setup-password", setupData);
  return data;
}

export function useSetupPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: setupPassword,
    onSuccess: (data) => {
      toast.success("Password Set Successfully", {
        description: data.message,
      });
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error("Failed to set password", {
        description:
          error.response?.data?.message || "An unexpected error occurred.",
      });
    },
  });
}
