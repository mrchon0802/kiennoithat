export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
}

/** Backend trả về */
export interface CartResponse {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

/** Redux state */
export interface CartState extends CartResponse {
  loading: boolean;
  error: string | null;
}

/** Payload */
export interface AddToCartPayload {
  userId: string;
  items: CartItem[];
}

export interface UpdateCartPayload {
  productId: string;
  quantity: number;
}

export interface RemoveCartItemPayload {
  userId: string;
  productId: string;
  size?: string;
  color?: string;
}
