"use client";

import React, { useEffect, useMemo } from "react";
import styles from "./OrderHistory.module.css";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";
import { fetchOrdersByUser } from "@/store/orderSlice";
import { ProductCardOrder } from "@/type/product-card";

/* ===================== COMPONENT ===================== */

const OrderHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 👤 User hiện tại
  const currentUser = useSelector((state: RootState) => state.login.user);

  // 📦 Order state (DOMAIN)
  const { orders, loading } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchOrdersByUser(currentUser._id));
    }
  }, [dispatch, currentUser?._id]);

  /**
   * 🔁 MAP Order (domain) → ProductCardOrder (UI)
   */
  const productCardOrders: ProductCardOrder[] = useMemo(() => {
    if (!currentUser?._id) return [];

    return orders
      .filter((order) => order.userId === currentUser._id)
      .map((order) => {
        const firstItem = order.items[0];

        return {
          _id: order._id,
          name: firstItem?.title ?? "Sản phẩm",
          productImage: firstItem?.color?.productImage ?? "",
        };
      });
  }, [orders, currentUser?._id]);

  return (
    <main className={styles.mainContent}>
      <h2>Lịch Sử Đặt Hàng</h2>

      <div className={styles.productsGrid}>
        {loading && <p>Đang tải đơn hàng...</p>}

        {!loading && productCardOrders.length === 0 && <p>Chưa có đơn hàng</p>}

        {!loading &&
          productCardOrders.map((order) => (
            <ProductCard key={order._id} order={order} />
          ))}
      </div>
    </main>
  );
};

export default OrderHistory;
