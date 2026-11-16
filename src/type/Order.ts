export type OrderStatus =
  | "pending" | "confirmed" | "preparing" | "ready_to_ship"
  | "shipping" | "completed" | "cancelled" | "delivery_failed";

export type PaymentMethod = "cod" | "bank_transfer";
export type PaymentStatus =
  | "unpaid" | "awaiting_confirmation" | "partially_paid" | "paid" | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  address: string;
  districtId: number;
  wardCode: string;
}

export interface Order {
  _id: string;
  orderCode: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalPrice: number;
  status: OrderStatus;
  cancellationStatus?: "none" | "requested" | "approved" | "rejected";
  cancellationReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  _id: string;
  orderId: string;
  method: PaymentMethod;
  totalAmount: number;
  depositRequired: boolean;
  depositAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: PaymentStatus;
  transactions: Array<{
    amount: number;
    method: PaymentMethod;
    reference?: string;
    note?: string;
    receivedAt: string;
    confirmedBy: string;
  }>;
  refunds?: Array<{ amount: number; reason: string; refundedAt: string }>;
  refundedAmount?: number;
}

export interface Delivery {
  _id: string;
  orderId: string;
  deliveryCode: string;
  assignedTo: string;
  scheduledDate: string;
  timeSlot?: string;
  status: "scheduled" | "picked_up" | "delivering" | "delivered" | "failed" | "rescheduled";
  deliveredAt?: string;
  failureReason?: string;
  note?: string;
}

export interface OrderStatusHistory {
  _id: string;
  orderId: string;
  fromStatus?: string;
  toStatus: string;
  actorId: string;
  actorRole: string;
  note?: string;
  createdAt: string;
}

export interface OrderDetailResponse {
  order: Order;
  payment: Payment | null;
  deliveries: Delivery[];
  statusHistory: OrderStatusHistory[];
}

export interface CreateOrderPayload {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingFee: number;
  discount?: number;
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface CreateOrderResponse {
  order: Order;
  payment: Payment;
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}
