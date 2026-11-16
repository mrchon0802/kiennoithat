"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { fetchOrdersByUser } from "@/store/orderSlice";
import styles from "./OrderHistory.module.css";

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận", confirmed: "Đã xác nhận", preparing: "Đang chuẩn bị",
  ready_to_ship: "Chờ giao hàng", shipping: "Đang giao", completed: "Hoàn thành",
  cancelled: "Đã hủy", delivery_failed: "Giao hàng thất bại",
};
const money = (n = 0) => `${Number(n).toLocaleString("vi-VN")} ₫`;

export default function OrderHistory() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.login.user);
  const initialized = useSelector((s: RootState) => s.login.initialized);
  const { orders, loading, error } = useSelector((s: RootState) => s.order);

  useEffect(() => {
    if (initialized && user?._id) dispatch(fetchOrdersByUser());
  }, [dispatch, initialized, user?._id]);

  if (!initialized || loading) return <main className={styles.mainContent}>Đang tải đơn hàng...</main>;
  if (!user) return <main className={styles.mainContent}>Vui lòng đăng nhập để xem đơn hàng.</main>;

  return (
    <main className={styles.mainContent}>
      <h2>Đơn hàng của tôi</h2>
      <p className={styles.description}>Theo dõi trạng thái xử lý, thanh toán và giao hàng.</p>
      {error && <p className={styles.error}>{error}</p>}
      {!orders.length ? <div className={styles.empty}>Bạn chưa có đơn hàng nào.</div> : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <article className={styles.orderCard} key={order._id}>
              <header className={styles.orderHeader}>
                <strong>{order.orderCode}</strong>
                <span className={styles.status}>{statusLabels[order.status] ?? order.status}</span>
              </header>
              {order.items.map((item, index) => (
                <div className={styles.item} key={`${item.productId}-${index}`}>
                  <div className={styles.image}>
                    {item.image ? <Image src={item.image} alt={item.name} width={76} height={76}/> : null}
                  </div>
                  <div className={styles.itemInfo}>
                    <strong>{item.name}</strong>
                    <span>{[item.size, item.color].filter(Boolean).join(" · ") || "Không có phân loại"}</span>
                    <span>x{item.quantity}</span>
                  </div>
                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
              ))}
              <footer className={styles.orderFooter}>
                <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                <strong>Tổng: {money(order.totalPrice)}</strong>
                <Link href={`/my-account/order-history/${order._id}`}>Xem chi tiết</Link>
              </footer>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
