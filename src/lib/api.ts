import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const publicPaths = [
      "/auth/login",
      "/auth/refresh-token",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/setup-password",
    ];

    const isPublicPath = publicPaths.some((path) =>
      originalRequest.url?.includes(path)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicPath
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await api.post("auth/refresh-token");
        const { accessToken } = data;
        useAuthStore.getState().setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().setAccessToken(null);
        // Using window.location to force a full page reload to the login page
        // which clears all state and avoids inconsistent states.
        const publicPathsForRedirect = [
          "/login",
          "/forgot-password",
          "/reset-password",
          "/setup-password",
        ];
        const isAlreadyOnPublicPage = publicPathsForRedirect.some((path) =>
          window.location.pathname.startsWith(path)
        );

        if (!isAlreadyOnPublicPage) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;