// src/api/orderApi.js
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const orderApi = {
  /**
   *  Tạo đơn hàng mới
   * Body: { userId, items[], totalPrice }
   * POST /orders
   */
  create: async (orderData) => {
    const res = await axios.post(`${API_URL}/orders`, orderData);
    return res.data;
  },

  /**
   *  Lấy toàn bộ đơn hàng (admin)
   * GET /orders
   */
  getAll: async () => {
    const res = await axios.get(`${API_URL}/orders`);
    return res.data;
  },

  /**
   * 👤 Lấy danh sách đơn hàng của 1 user
   * GET /orders/user/:userId
   */
  getByUser: async (userId) => {
    const res = await axios.get(`${API_URL}/orders/user/${userId}`);
    return res.data;
  },

  /**
   *  Cập nhật trạng thái đơn hàng
   * PATCH /orders/:orderId/status
   * Body: { status: "paid" | "shipped" | "completed" | "cancelled" }
   */
  updateStatus: async (orderId, status) => {
    const res = await axios.patch(`${API_URL}/orders/${orderId}/status`, {
      status,
    });
    return res.data;
  },

  /**
   *  Xóa 1 đơn hàng
   * DELETE /orders/:orderId
   */
  remove: async (orderId) => {
    const res = await axios.delete(`${API_URL}/orders/${orderId}`);
    return res.data;
  },

  /**
   *  Xóa toàn bộ đơn hàng (admin)
   * DELETE /orders
   */
  clearAll: async () => {
    const res = await axios.delete(`${API_URL}/orders`);
    return res.data;
  },
};
