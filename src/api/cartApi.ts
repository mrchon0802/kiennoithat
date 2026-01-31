import axiosInstance from "./axiosInstance";
import type {
  AddToCartPayload,
  UpdateCartPayload,
  UpdateCartItemPayload,
  RemoveCartItemPayload,
} from "@/type/Cart.payload";
import type { CartResponse } from "@/type/Cart.response";

export const cartApi = {
  /** 🛒 Lấy giỏ hàng */
  getByUser: async (userId: string): Promise<CartResponse> => {
    const res = await axiosInstance.get<CartResponse>(`/cart/${userId}`);
    return res.data;
  },

  /** ➕ Thêm sản phẩm */
  addToCart: async (payload: AddToCartPayload): Promise<CartResponse> => {
    const res = await axiosInstance.post<CartResponse>("/cart", payload);
    return res.data;
  },

  /** 🔄 Cập nhật số lượng */
  /** 🔄 Cập nhật số lượng */
  updateQuantity: async (
    userId: string,
    payload: UpdateCartItemPayload,
  ): Promise<CartResponse> => {
    const res = await axiosInstance.patch<CartResponse>(
      `/cart/${userId}`,
      payload,
    );
    return res.data;
  },

  /** ❌ Xóa 1 sản phẩm */
  removeItem: async (payload: RemoveCartItemPayload): Promise<CartResponse> => {
    const res = await axiosInstance.delete<CartResponse>("/cart/item", {
      data: payload,
    });
    return res.data;
  },

  /** 💣 Xóa toàn bộ */
  clearByUser: async (userId: string): Promise<CartResponse> => {
    const res = await axiosInstance.delete<CartResponse>(`/cart/${userId}`);
    return res.data;
  },
};
