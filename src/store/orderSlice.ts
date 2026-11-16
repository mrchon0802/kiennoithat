import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { orderApi } from "@/api/orderApi";
import type { Order, OrderState, CreateOrderPayload, OrderStatus, CreateOrderResponse } from "@/type/Order";

export const createOrder = createAsyncThunk<CreateOrderResponse, CreateOrderPayload, { rejectValue: string }>(
  "order/create",
  async (payload, { rejectWithValue }) => {
    try { return await orderApi.create(payload); }
    catch (err: any) { return rejectWithValue(err.response?.data?.message ?? "Không thể tạo đơn hàng"); }
  },
);

export const fetchOrdersByUser = createAsyncThunk<Order[], void, { rejectValue: string }>(
  "order/fetchMine",
  async (_, { rejectWithValue }) => {
    try { return await orderApi.getMine(); }
    catch (err: any) { return rejectWithValue(err.response?.data?.message ?? "Không thể tải đơn hàng"); }
  },
);

export const fetchAllOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  "order/fetchAll",
  async (_, { rejectWithValue }) => {
    try { return await orderApi.getAll(); }
    catch (err: any) { return rejectWithValue(err.response?.data?.message ?? "Không thể tải đơn hàng"); }
  },
);

export const updateOrderStatus = createAsyncThunk<Order, { orderId: string; status: OrderStatus; note?: string }, { rejectValue: string }>(
  "order/updateStatus",
  async ({ orderId, status, note }, { rejectWithValue }) => {
    try { return await orderApi.updateStatus(orderId, status, note); }
    catch (err: any) { return rejectWithValue(err.response?.data?.message ?? "Không thể cập nhật trạng thái"); }
  },
);

const initialState: OrderState = { orders: [], loading: false, error: null };
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchOrdersByUser.fulfilled, (s, a: PayloadAction<Order[]>) => { s.loading = false; s.orders = a.payload; })
      .addCase(fetchOrdersByUser.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? "Lỗi tải đơn hàng"; })
      .addCase(fetchAllOrders.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAllOrders.fulfilled, (s, a: PayloadAction<Order[]>) => { s.loading = false; s.orders = a.payload; })
      .addCase(fetchAllOrders.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? "Lỗi tải đơn hàng"; })
      .addCase(createOrder.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createOrder.fulfilled, (s, a) => { s.loading = false; s.orders.unshift(a.payload.order); })
      .addCase(createOrder.rejected, (s, a) => { s.loading = false; s.error = a.payload ?? "Lỗi tạo đơn hàng"; })
      .addCase(updateOrderStatus.fulfilled, (s, a) => {
        const i = s.orders.findIndex((o) => o._id === a.payload._id);
        if (i >= 0) s.orders[i] = a.payload;
      });
  },
});
export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
