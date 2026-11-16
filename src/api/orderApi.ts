import axiosInstance from "./axiosInstance";
import type {
  Order, OrderStatus, CreateOrderPayload, CreateOrderResponse,
  OrderDetailResponse, PaymentMethod,
} from "@/type/Order";

export const orderApi = {
  create: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
    const res = await axiosInstance.post<CreateOrderResponse>("/orders", payload);
    return res.data;
  },
  getAll: async (): Promise<Order[]> => {
    const res = await axiosInstance.get<Order[]>("/orders");
    return res.data;
  },
  getMine: async (): Promise<Order[]> => {
    const res = await axiosInstance.get<Order[]>("/orders/my-orders");
    return res.data;
  },
  getById: async (orderId: string): Promise<OrderDetailResponse> => {
    const res = await axiosInstance.get<OrderDetailResponse>(`/orders/${orderId}`);
    return res.data;
  },
  updateStatus: async (orderId: string, status: OrderStatus, note?: string): Promise<Order> => {
    const res = await axiosInstance.patch<Order>(`/orders/${orderId}/status`, { status, note });
    return res.data;
  },
  requestCancellation: async (orderId: string, reason: string): Promise<Order> => {
    const res = await axiosInstance.post<Order>(`/orders/${orderId}/cancellation-request`, { reason });
    return res.data;
  },
  reviewCancellation: async (orderId: string, decision: "approved" | "rejected", note?: string): Promise<Order> => {
    const res = await axiosInstance.patch<Order>(`/orders/${orderId}/cancellation`, { decision, note });
    return res.data;
  },
  setDeposit: async (orderId: string, amount: number): Promise<unknown> => {
    const res = await axiosInstance.patch(`/orders/${orderId}/payment/deposit`, { amount });
    return res.data;
  },
  addTransaction: async (orderId: string, data: { amount: number; method: PaymentMethod; reference?: string; note?: string }): Promise<unknown> => {
    const res = await axiosInstance.post(`/orders/${orderId}/payment/transactions`, data);
    return res.data;
  },
  addRefund: async (orderId: string, data: { amount: number; reason: string }): Promise<unknown> => {
    const res = await axiosInstance.post(`/orders/${orderId}/payment/refunds`, data);
    return res.data;
  },
  createDelivery: async (orderId: string, data: { scheduledDate: string; timeSlot?: string; note?: string }): Promise<unknown> => {
    const res = await axiosInstance.post(`/orders/${orderId}/deliveries`, data);
    return res.data;
  },
  updateDelivery: async (orderId: string, deliveryId: string, data: { status: string; scheduledDate?: string; timeSlot?: string; note?: string; failureReason?: string }): Promise<unknown> => {
    const res = await axiosInstance.patch(`/orders/${orderId}/deliveries/${deliveryId}`, data);
    return res.data;
  },
};
