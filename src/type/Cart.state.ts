// type/cart.state.ts
import type { CartResponse } from "./Cart.response";

export interface CartState extends CartResponse {
  loading: boolean;
  error: string | null;
}
