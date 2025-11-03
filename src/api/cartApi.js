import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const cartApi = {
  /**  Lấy giỏ hàng user */
  getByUser: async (userId) => {
    const res = await axios.get(`${API_URL}/cart/${userId}`);
    return res.data;
  },

  /**  Thêm sản phẩm */
  addToCart: async (payload) => {
    const res = await axios.post(`${API_URL}/cart`, payload);
    return res.data;
  },

  /**  Cập nhật số lượng */
  updateQuantity: async (userId, payload) => {
    const res = await axios.patch(`${API_URL}/cart/${userId}`, payload);
    return res.data;
  },

  /**  Xóa 1 sản phẩm */
  removeItem: async (payload) => {
    const res = await axios.delete(`${API_URL}/cart/item`, { data: payload });
    return res.data;
  },

  /**  Xóa toàn bộ */
  clearByUser: async (userId) => {
    const res = await axios.delete(`${API_URL}/cart/${userId}`);
    return res.data;
  },
};
