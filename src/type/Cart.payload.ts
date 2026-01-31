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
  items: UpdateCartItemPayload[];
}

export interface RemoveCartItemPayload {
  userId: string;
  productId: string;
  size?: string;
  color?: string;
}
