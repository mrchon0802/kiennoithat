import axiosInstance from "./axiosInstance";
import { User } from "@/type/User";

/* ===================== TYPES (API-ONLY) ===================== */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  fullName?: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  fullAddress?: string;
  phone?: string;
  password?: string;
  address?: string;
  toDistrictId?: number;
  toWardCode?: string;
  phoneNumber?: string;
  backupPhoneNumber?: string;
}

/* ===================== API ===================== */

export const userApi = {
  /* ---------- USER ---------- */

  getAll: () => axiosInstance.get<User[]>("/users"),

  getById: (id: string) => axiosInstance.get<User>(`/users/${id}`),

  getByEmail: async (email: string): Promise<User> => {
    const res = await axiosInstance.get<User>(`/users/email/${email}`);
    return res.data;
  },

  create: (data: CreateUserPayload) => axiosInstance.post<User>("/users", data),

  update: (id: string, data: UpdateUserPayload) =>
    axiosInstance.put<User>(`/users/${id}`, data),

  remove: (id: string) => axiosInstance.delete<void>(`/users/${id}`),

  clearAll: () => axiosInstance.delete<void>("/users"),

  /* ---------- AUTH ---------- */

  login: (payload: LoginPayload) => axiosInstance.post("/auth/login", payload),

  logout: () => axiosInstance.post<void>("/auth/logout"),

  refresh: () => axiosInstance.post("/auth/refresh"),

  me: () => axiosInstance.get<User>("/auth/me"),
};
