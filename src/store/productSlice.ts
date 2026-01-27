import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type {
  PurchasedProduct,
  PurchasedProductState,
  WarrantyStatus,
} from "@/type/Product";

/* ===================== INITIAL STATE ===================== */

const initialState: PurchasedProductState = {
  products: [],
};

/* ===================== PAYLOAD TYPES ===================== */

interface AddPurchasedProductPayload extends Omit<
  PurchasedProduct,
  "id" | "purchaseDate" | "warrantyRequest"
> {}

interface AddWarrantyRequestPayload {
  id: string;
  content: string;
}

interface UpdateWarrantyStatusPayload {
  id: string;
  status: WarrantyStatus;
}

/* ===================== SLICE ===================== */

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    /** Add purchased product */
    addPurchasedProduct: (
      state,
      action: PayloadAction<AddPurchasedProductPayload>,
    ) => {
      const newProduct: PurchasedProduct = {
        id: uuidv4(),
        purchaseDate: new Date().toISOString(),
        warrantyRequest: null,
        ...action.payload,
      };

      state.products.push(newProduct);
    },

    /** Remove purchased product */
    removePurchasedProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },

    /** Create warranty request */
    addWarrantyRequest: (
      state,
      action: PayloadAction<AddWarrantyRequestPayload>,
    ) => {
      const product = state.products.find((p) => p.id === action.payload.id);

      if (product) {
        product.warrantyRequest = {
          id: uuidv4(),
          content: action.payload.content,
          status: "pending",
          createdAt: new Date().toISOString(),
        };
      }
    },

    /** Update warranty status */
    updateWarrantyStatus: (
      state,
      action: PayloadAction<UpdateWarrantyStatusPayload>,
    ) => {
      const product = state.products.find((p) => p.id === action.payload.id);

      if (product?.warrantyRequest) {
        product.warrantyRequest.status = action.payload.status;
      }
    },
  },
});

/* ===================== EXPORT ===================== */

export const {
  addPurchasedProduct,
  addWarrantyRequest,
  removePurchasedProduct,
  updateWarrantyStatus,
} = productSlice.actions;

export default productSlice.reducer;
