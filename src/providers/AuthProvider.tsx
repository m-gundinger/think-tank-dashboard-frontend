import { useAuthStore } from "@/store/auth";
import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function AuthProvider({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!accessToken && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [accessToken, navigate, location.pathname]);

  return <>{children}</>;
}
