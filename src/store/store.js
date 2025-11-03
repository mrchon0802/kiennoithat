import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import loginReducer from "./loginSlice";
import orderReducer from "./orderSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
const rootReducer = {
  users: userReducer,
  login: loginReducer,
  order: orderReducer,
  cart: cartReducer,
  products: productReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});
