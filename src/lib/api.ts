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

    console.log("Axios Interceptor: Caught an error.", {
      url: originalRequest.url,
      status: error.response?.status,
    });

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh-token");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      console.log(
        "Axios Interceptor: Intercepted 401. Attempting token refresh."
      );
      originalRequest._retry = true;
      try {
        const { data } = await api.post("/auth/refresh-token");
        const { accessToken } = data;
        useAuthStore.getState().setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Axios Interceptor: Token refresh failed.", refreshError);
        useAuthStore.getState().setAccessToken(null);
        console.error("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      }
    }

    console.log(
      "Axios Interceptor: Error was not a 401 or was an auth endpoint. Rejecting promise."
    );
    return Promise.reject(error);
  }
);

export default api;
