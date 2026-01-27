// src/types/order.ts

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "completed"
  | "cancelled";

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  size: string;
  color: {
    _id: string;
    name: string;
    image: string;
    productImage: string;
  };
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderPayload {
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  address: string;
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}
