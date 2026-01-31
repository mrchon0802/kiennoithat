// type/cart.response.ts
import type { CartItemBase } from "./Cart.model";

export interface CartResponse {
  items: CartItemBase[];
  totalQuantity: number;
  totalPrice: number;
}
