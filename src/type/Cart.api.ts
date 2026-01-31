import { CartItemBase } from "./Cart.model";

export interface CartItem extends CartItemBase {
  title: string;
}

export interface CartResponse {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}
