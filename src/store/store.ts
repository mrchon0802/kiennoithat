import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import loginReducer from "./loginSlice";
import orderReducer from "./orderSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    login: loginReducer,
    order: orderReducer,
    cart: cartReducer,
    products: productReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

/* ===================== TYPES ===================== */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
