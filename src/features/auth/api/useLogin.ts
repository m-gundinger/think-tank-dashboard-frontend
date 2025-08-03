import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "@/hooks/useApiMutation";

async function login(credentials: any): Promise<any> {
  const { data } = await api.post("auth/login", credentials);
  return data;
}

export function useLogin() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  return useApiMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      navigate("/home", { replace: true });
    },
  });
}