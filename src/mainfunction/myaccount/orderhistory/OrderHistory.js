"use client";

import React, { useEffect } from "react";
import styles from "./OrderHistory.module.css";
import ProductCard from "./ProductCard";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addOrder } from "../../../store/orderSlice";
import { nanoid } from "@reduxjs/toolkit";

export default function OrderHistory() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const currentId = useSelector((state) => state.login.currentId);
  useEffect(() => {
    if (orders.length === 0) {
      dispatch(
        addOrder({
          id: nanoid(),
          userId: currentId,
          name: "Ghế Sofa Cao Cấp",
          material: "Gỗ tự nhiên",
          size: "2m x 1m",
          color: "Nâu",
          fabricColor: "Xám",
          fabricMaterial: "Vải nỉ",
          quanity: 1,
          price: "20.000.000 VNĐ",
          image: "/demo.png",
        })
      );
    }
  }, [currentId, dispatch, orders.length]);
  const currentOrder = orders?.filter((o) => o.userId === currentId);
  return (
    <main className={styles.mainContent}>
      <h2>Lịch Sử Đặt Hàng</h2>
      <div className={styles.productsGrid}>
        {currentOrder.length > 0
          ? currentOrder.map((order) => (
              <ProductCard key={order.id} order={order} />
            ))
          : "Chưa có đơn hàng"}
      </div>
    </main>
  );
}
