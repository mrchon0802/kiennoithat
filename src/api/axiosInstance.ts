import type { AuthUser } from "@/type/Login";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  withCredentials: true,
});

let refreshPromise: Promise<AxiosResponse<{ user: AuthUser }>> | null = null;

/**
 * Dùng chung một refresh request cho cả interceptor và AuthInitializer.
 * Backend lưu refresh_token trong HTTP-only cookie và trả về { user }.
 */
export const refreshSession = (): Promise<AxiosResponse<{ user: AuthUser }>> => {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post<{ user: AuthUser }>("/auth/refresh")
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;
  const path = url.split("?")[0].replace(/\/$/, "");
  return (
    path.endsWith("/auth/login") ||
    path.endsWith("/auth/refresh") ||
    path.endsWith("/auth/logout")
  );
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    if (
      error.response.status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshSession();
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
