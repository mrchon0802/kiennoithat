import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderApi } from "@/api/orderApi";

//  Tạo đơn hàng mới
export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await orderApi.create(orderData);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Create order failed");
    }
  }
);

// 👤 Lấy danh sách đơn hàng của 1 user
export const fetchOrdersByUser = createAsyncThunk(
  "order/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await orderApi.getByUser(userId);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch user orders failed");
    }
  }
);

//  Admin – lấy tất cả đơn hàng
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await orderApi.getAll();
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch all orders failed");
    }
  }
);

//  Cập nhật trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await orderApi.updateStatus(orderId, status);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update status failed");
    }
  }
);

//  Xóa đơn hàng
export const deleteOrder = createAsyncThunk(
  "order/delete",
  async (orderId, { rejectWithValue }) => {
    try {
      await orderApi.remove(orderId);
      return orderId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete order failed");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Lấy danh sách đơn hàng
      .addCase(fetchOrdersByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Tạo đơn hàng
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cập nhật trạng thái đơn
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      // Xóa đơn hàng
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      })

      // Lấy tất cả đơn hàng (admin)
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export default orderSlice.reducer;
