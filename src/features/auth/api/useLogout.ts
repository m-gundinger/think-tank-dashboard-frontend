import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

async function logoutUser() {
  return api.post("/auth/logout");
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();

      setAccessToken(null);

      navigate("/login", { replace: true });
      toast.info("You have been successfully logged out.");
    },
    onError: () => {
      queryClient.clear();
      setAccessToken(null);
      navigate("/login", { replace: true });
      toast.warning(
        "Could not contact the server, but you have been logged out locally."
      );
    },
  });
}
