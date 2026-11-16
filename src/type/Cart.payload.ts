export interface CartItemPayload {
  productId: string;
  name: string;
  image: string;
  price: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  size: string;
  color: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface UpdateCartPayload extends UpdateCartItemPayload {
  userId: string;
}

export interface AddToCartPayload {
  userId: string;
  items: CartItemPayload[];
}

export interface RemoveCartItemPayload {
  userId: string;
  productId: string;
  size?: string;
  color?: string;
}
