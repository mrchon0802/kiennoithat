import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { cartApi } from "@/api/cartApi";
import type {
  AddToCartPayload,
  UpdateCartPayload,
  RemoveCartItemPayload,
} from "@/type/Cart.payload";
import type { CartState } from "@/type/Cart.state";
import type { CartResponse } from "@/type/Cart.response";

/** Fetch */
export const fetchCart = createAsyncThunk<CartResponse, string>(
  "cart/fetch",
  async (userId) => cartApi.getByUser(userId),
);

/** Add */
export const addToCart = createAsyncThunk<CartResponse, AddToCartPayload>(
  "cart/add",
  async (payload) => cartApi.addToCart(payload),
);

/** Update */
export const updateCartItem = createAsyncThunk<CartResponse, UpdateCartPayload>(
  "cart/update",
  async ({ userId, ...payload }) => {
    return cartApi.updateQuantity(userId, payload);
  },
);

/** Remove */
export const removeFromCart = createAsyncThunk<
  CartResponse,
  RemoveCartItemPayload
>("cart/remove", async (payload) => {
  return cartApi.removeItem(payload);
});

/** Clear */
export const clearCart = createAsyncThunk<CartResponse, string>(
  "cart/clear",
  async (userId) => cartApi.clearByUser(userId),
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
