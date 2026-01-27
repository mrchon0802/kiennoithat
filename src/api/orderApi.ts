import axios from "axios";
import type { Order, OrderStatus, CreateOrderPayload } from "@/type/Order";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const orderApi = {
  create: async (orderData: CreateOrderPayload): Promise<Order> => {
    const res = await axios.post<Order>(`${API_URL}/orders`, orderData);
    return res.data;
  },

  getAll: async (): Promise<Order[]> => {
    const res = await axios.get<Order[]>(`${API_URL}/orders`);
    return res.data;
  },

  getByUser: async (userId: string): Promise<Order[]> => {
    const res = await axios.get<Order[]>(`${API_URL}/orders/user/${userId}`);
    return res.data;
  },

  updateStatus: async (
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> => {
    const res = await axios.patch<Order>(
      `${API_URL}/orders/${orderId}/status`,
      { status },
    );
    return res.data;
  },

  remove: async (orderId: string): Promise<void> => {
    await axios.delete(`${API_URL}/orders/${orderId}`);
  },

  clearAll: async (): Promise<void> => {
    await axios.delete(`${API_URL}/orders`);
  },
};
