"use client";

import React, { useEffect } from "react";
import styles from "./OrderHistory.module.css";
import ProductCard from "./ProductCard";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchOrdersByUser } from "../../../store/orderSlice";
import { nanoid } from "@reduxjs/toolkit";
import { createOrder } from "@/store/orderSlice";

export default function OrderHistory() {
  const dispatch = useDispatch();

  //thonh tin user hien tai
  const currentUser = useSelector((state) => state.login.user);

  //thong tin order
  const orders = useSelector((state) => state.order.orders);
  const loading = useSelector((state) => state.order.loading);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchOrdersByUser(currentUser._id));
    }
  }, [dispatch, currentUser]);

  const userOrders = orders?.filter((o) => o.userId === currentUser?._id) || [];

  return (
    <main className={styles.mainContent}>
      <h2>Lịch Sử Đặt Hàng</h2>
      <div className={styles.productsGrid}>
        {userOrders.length > 0
          ? userOrders.map((order) => (
              <ProductCard key={order.id} order={order} />
            ))
          : "Chưa có đơn hàng"}
      </div>
    </main>
  );
}
