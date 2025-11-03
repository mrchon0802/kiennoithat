import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "@/api/cartApi";

/** Fetch */
export const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  return await cartApi.getByUser(userId);
});

/** Add */
export const addToCart = createAsyncThunk("cart/add", async (payload) => {
  return await cartApi.addToCart(payload);
});

/** Update quantity */
export const updateCartItem = createAsyncThunk(
  "cart/update",
  async ({ userId, ...payload }) => {
    return await cartApi.updateQuantity(userId, payload);
  }
);

/** Remove */
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ userId, productId, size, color }) => {
    return await cartApi.removeItem({ userId, productId, size, color });
  }
);

/** Clear */
export const clearCart = createAsyncThunk("cart/clear", async (userId) => {
  return await cartApi.clearByUser(userId);
});

/** Shared reducer for all fulfilled states */
const handleSuccess = (state, action) => {
  state.loading = false;
  state.error = null;

  const { items, totalQuantity, totalPrice } = action.payload;
  state.items = items;
  state.totalQuantity = totalQuantity;
  state.totalPrice = totalPrice;
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
    totalQuantity: 0,
    totalPrice: 0,
  },
  extraReducers: (builder) => {
    [fetchCart, addToCart, updateCartItem, removeFromCart, clearCart].forEach(
      (action) => {
        builder
          .addCase(action.pending, (state) => {
            state.loading = true;
          })
          .addCase(action.fulfilled, handleSuccess)
          .addCase(action.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error?.message || "Error";
          });
      }
    );
  },
});

export default cartSlice.reducer;
