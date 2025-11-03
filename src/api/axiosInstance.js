import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post("/auth/refresh"); // gọi refresh token
        return axiosInstance(originalRequest); // gọi lại request ban đầu
      } catch (refreshError) {
        console.error("Refresh token thất bại:", refreshError);
        // Có thể logout ở đây nếu muốn
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
