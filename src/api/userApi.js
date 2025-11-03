import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userApi = {
  // --- USER ---
  getAll: () => axiosInstance.get("/users"),
  getById: (id) => axiosInstance.get(`/users/${id}`),
  getByEmail: async (email) => {
    try {
      const res = axiosInstance.get(`/users/email/${email}`);
      return (await res).data;
    } catch (err) {
      console.error("Lỗi khi gọi getByEmail:", err);
      throw err;
    }
  },
  create: (data) => axiosInstance.post("/users", data),
  update: (id, data) => axiosInstance.put(`/users/${id}`, data),
  remove: (id) => axiosInstance.delete(`/users/${id}`),
  clearAll: () => axiosInstance.delete("/users"),

  // --- AUTH ---
  login: (email, password) =>
    axiosInstance.post("/auth/login", { email, password }),

  logout: () => axiosInstance.post("/auth/logout"),

  refresh: () => axiosInstance.post("/auth/refresh"),

  me: () => axiosInstance.get("/auth/me"), // optional: lấy user từ Access token
};
