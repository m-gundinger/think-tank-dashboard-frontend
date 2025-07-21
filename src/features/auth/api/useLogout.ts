import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useApiMutation } from "@/hooks/useApiMutation";

async function logoutUser() {
  return api.post("/auth/logout");
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  return useApiMutation({
    mutationFn: logoutUser,
    successMessage: "You have been successfully logged out.",
    onSuccess: () => {
      queryClient.clear();
      setAccessToken(null);
      navigate("/login", { replace: true });
    },
    errorMessage:
      "Could not contact the server, but you have been logged out locally.",
  });
}
