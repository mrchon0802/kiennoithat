import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  orders: [], // mảng các sản phẩm đã thêm
  selectingOrder: {
    id: null,
    name: "",
    image: "",
    price: "",
    size: "",
    color: "",
    quantity: "",
  },
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateSelectingOrder: (state, action) => {
      state.selectingOrder = { ...state.selectingOrder, ...action.payload };
    },
    clearSelectingOrder: (state) => {
      state.selectingOrder = initialState.selectingOrder;
    },
    addOrder: (state, action) => {
      // action.payload = { id, name, image, price, size, color, quantity }
      const newOrder = { id: uuidv4(), ...action.payload };
      state.orders.push(newOrder);
    },

    removeOrder: (state, action) => {
      // action.payload = id
      state.orders = state.orders.filter((p) => p.id !== action.payload);
    },
    clearOrder: (state) => {
      state.orders = [];
    },
  },
});

export const {
  addOrder,
  removeOrder,
  clearOrder,
  updateSelectingOrder,
  clearSelectingOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
