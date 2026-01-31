import { CartItemBase } from "./Cart.model";

export interface ShoppingCartItem extends CartItemBase {
  // phục vụ tính phí ship (UI only)
  weight?: number;
  length?: number;
  width?: number;
  height?: number;

  // UI-only fields
  shipping?: number;
  itemSubtotal?: number;
  itemTotal?: number;
}
