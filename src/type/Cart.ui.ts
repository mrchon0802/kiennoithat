import type { CartItemBase } from "./Cart.model";

export interface ShoppingCartItem extends CartItemBase {
  // UI-only fields
  shipping?: number;
  itemSubtotal?: number;
  itemTotal?: number;
}
