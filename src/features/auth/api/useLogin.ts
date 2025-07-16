import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

async function login(credentials: any): Promise<any> {
  console.log(
    "useLogin: Firing API call to /auth/login with credentials:",
    credentials
  );
  const { data } = await api.post("/auth/login", credentials);
  return data;
}

export function useLogin() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  return useMutation<any, AxiosError, any>({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("useLogin: Login successful, received data:", data);
      setAccessToken(data.accessToken);
      navigate("/dashboard", { replace: true });
    },
    onError: (error) => {
      console.error("useLogin: Login failed with error object:", error);
      if (error.response) {
        console.error("useLogin: Error response data:", error.response.data);
        console.error(
          "useLogin: Error response status:",
          error.response.status
        );
      } else if (error.request) {
        console.error(
          "useLogin: No response received, request was:",
          error.request
        );
      } else {
        console.error("useLogin: Error setting up request:", error.message);
      }
    },
  });
}
