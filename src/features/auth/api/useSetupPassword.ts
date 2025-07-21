import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "@/hooks/useApiMutation";
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
  return useApiMutation({
    mutationFn: setupPassword,
    successMessage: (data) => data.message,
    onSuccess: () => {
      navigate("/login");
    },
  });
}
