import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/* ===================== EXTEND TYPE ===================== */
/**
 * Mở rộng config để thêm _retry
 */
interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/* ===================== INSTANCE ===================== */

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
  withCredentials: true,
});

/* ===================== RESPONSE INTERCEPTOR ===================== */

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    // Nếu không có response → lỗi network
    if (!error.response) {
      return Promise.reject(error);
    }

    // 401 + chưa retry + không phải refresh API
    if (
      error.response.status === 401 &&
      originalRequest.url !== "/auth/refresh" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Token hết hạn, đang refresh...");

        await axiosInstance.post("/auth/refresh");

        console.log("✅ Refresh thành công, retry request cũ");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token thất bại:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
