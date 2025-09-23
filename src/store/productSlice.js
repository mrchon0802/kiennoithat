import { createSlice } from "@reduxjs/toolkit";
import React from "react";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  products: [], // mảng các sản phẩm đã thêm
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addPurchasedProduct: (state, action) => {
      const newProduct = {
        id: uuidv4(),
        userId: action.payload.userId,
        ...action.payload,
        purchaseDate: new Date().toISOString(),
        warrantyRequest: null,
      };
      state.products.push(newProduct);
    },
    removePurchasedProduct: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    addWarrantyRequest: (state, action) => {
      const product = state.products.find((p) => p.id === action.payload.id);
      if (product) {
        product.warrantyRequest = {
          id: uuidv4(),
          content: action.payload.content, //mo ta yeu cau
          status: "pending",
          createAt: new Date().toISOString(),
        };
      }
    },
    updateWarrantyStatus: (state, action) => {
      //action.payload = {id, status}
      const product = state.products.find((p) => p.id === action.payload.id);
      if (product && product.warrantyRequest) {
        product.warrantyRequest.status = action.payload.status;
      }
    },
  },
});

export const {
  addPurchasedProduct,
  addWarrantyRequest,
  removePurchasedProduct,
  updateWarrantyStatus,
} = productSlice.actions;

export default productSlice.reducer;
