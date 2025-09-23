import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import loginReducer from "./loginSlice";
import orderReducer from "./orderSlice";
import productReducer from "./productSlice";

//cau hinh persist
const persistConfig = {
  key: "root", //ten key luu trong local storage
  storage, // mac dinh dung local storage
  whitelist: ["users", "login", "orders"], //cac reducer muon luu
  version: 1,
};

//ket hop reducer
const rootReducer = {
  users: userReducer,
  login: loginReducer,
  orders: orderReducer,
  products: productReducer,
};

//goi persistreducer cho toan bo rootreducer
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(rootReducer)
);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), //tranh warning cuar redux-persist
  devTools: true,
});

//tao persistor de dung cho persistgate
export const persistor = persistStore(store);
