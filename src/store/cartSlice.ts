import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { cartApi } from "@/api/cartApi";
import type { CartState, CartResponse, AddToCartPayload } from "@/type/Cart";

/** Fetch */
export const fetchCart = createAsyncThunk<CartResponse, string>(
  "cart/fetch",
  async (userId) => {
    return await cartApi.getByUser(userId);
  },
);

/** Add */
export const addToCart = createAsyncThunk<CartResponse, AddToCartPayload>(
  "cart/add",
  async (payload) => {
    return await cartApi.addToCart(payload);
  },
);

/** Update quantity */
export const updateCartItem = createAsyncThunk<
  CartResponse,
  { userId: string; productId: string; quantity: number }
>("cart/update", async ({ userId, ...payload }) => {
  return await cartApi.updateQuantity(userId, payload);
});

/** Remove */
export const removeFromCart = createAsyncThunk<
  CartResponse,
  { userId: string; productId: string; size: string; color: string }
>("cart/remove", async (payload) => {
  return await cartApi.removeItem(payload);
});

/** Clear */
export const clearCart = createAsyncThunk<CartResponse, string>(
  "cart/clear",
  async (userId) => {
    return await cartApi.clearByUser(userId);
  },
);

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  totalQuantity: 0,
  totalPrice: 0,
};

const handleSuccess = (
  state: CartState,
  action: PayloadAction<CartResponse>,
) => {
  state.loading = false;
  state.error = null;
  state.items = action.payload.items;
  state.totalQuantity = action.payload.totalQuantity;
  state.totalPrice = action.payload.totalPrice;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
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
            state.error = action.error.message ?? "Error";
          });
      },
    );
  },
});

export default cartSlice.reducer;
