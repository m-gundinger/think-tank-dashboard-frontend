import { useAuthStore } from "@/store/auth";
import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function AuthProvider({ children }: { children: ReactNode }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicPaths = [
      "/login",
      "/forgot-password",
      "/reset-password",
      "/setup-password",
    ];
    const isPublicPath = publicPaths.some((path) =>
      location.pathname.startsWith(path)
    );

    if (!accessToken && !isPublicPath) {
      navigate("/login", { replace: true });
    }
  }, [accessToken, navigate, location.pathname]);

  return <>{children}</>;
}