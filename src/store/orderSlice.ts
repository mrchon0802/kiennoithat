import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { orderApi } from "@/api/orderApi";
import type {
  Order,
  OrderState,
  CreateOrderPayload,
  OrderStatus,
} from "@/type/Order";

/** Tạo đơn hàng mới */
export const createOrder = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { rejectValue: string }
>("order/create", async (orderData, { rejectWithValue }) => {
  try {
    return await orderApi.create(orderData);
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? "Create order failed");
  }
});

/** Lấy đơn hàng theo user */
export const fetchOrdersByUser = createAsyncThunk<
  Order[],
  string,
  { rejectValue: string }
>("order/fetchByUser", async (userId, { rejectWithValue }) => {
  try {
    return await orderApi.getByUser(userId);
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? "Fetch user orders failed");
  }
});

/** Admin – lấy tất cả đơn hàng */
export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await orderApi.getAll();
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? "Fetch all orders failed");
  }
});

/** Cập nhật trạng thái đơn hàng */
export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: OrderStatus },
  { rejectValue: string }
>("order/updateStatus", async ({ orderId, status }, { rejectWithValue }) => {
  try {
    return await orderApi.updateStatus(orderId, status);
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? "Update status failed");
  }
});

/** Xóa đơn hàng */
export const deleteOrder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("order/delete", async (orderId, { rejectWithValue }) => {
  try {
    await orderApi.remove(orderId);
    return orderId;
  } catch (err: any) {
    return rejectWithValue(err.response?.data ?? "Delete order failed");
  }
});

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /** Fetch by user */
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrdersByUser.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
        },
      )
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      })

      /** Create order */
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error";
      })

      /** Update status */
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          const index = state.orders.findIndex(
            (o) => o._id === action.payload._id,
          );
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
        },
      )

      /** Delete */
      .addCase(
        deleteOrder.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.orders = state.orders.filter((o) => o._id !== action.payload);
        },
      )

      /** Admin fetch all */
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.orders = action.payload;
        },
      );
  },
});

export default orderSlice.reducer;
