"use client";

import React from "react";
import styles from "./OrderDetail.module.css";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

/* =======================
   Types
======================= */

interface User {
  id: string;
  email?: string;
  phoneNumber?: string;
  backupPhoneNumber?: string;
  address?: string;
}

interface Order {
  id: string;
  userId: string;
  name?: string;
  material?: string;
  size?: string;
  color?: string;
  fabricColor?: string;
  fabricMaterial?: string;
  note?: string;
  quantity?: number;
  price?: number;
}

interface RootState {
  users: {
    users: User[];
  };
  login: {
    currentId: string;
  };
  orders: {
    orders: Order[];
  };
}

/* =======================
   Component
======================= */

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const users = useSelector((state: RootState) => state.users.users);
  const currentId = useSelector((state: RootState) => state.login.currentId);
  const orders = useSelector((state: RootState) => state.orders.orders);

  const currentUser = users.find((u) => u.id === currentId);
  const currentOrder = orders.find(
    (o) => String(o.id) === String(orderId) && o.userId === currentId,
  );

  if (!currentOrder || !currentUser) {
    return (
      <div className={styles.orderDetail}>
        <h2>Không tìm thấy đơn hàng</h2>
      </div>
    );
  }

  const { email, phoneNumber, backupPhoneNumber, address } = currentUser;

  const {
    name,
    material,
    size,
    color,
    fabricColor,
    fabricMaterial,
    note,
    quantity,
  } = currentOrder;

  const renderValue = (value?: React.ReactNode) => value || "Chưa có thông tin";

  return (
    <div className={styles.orderDetail}>
      <h1 className={styles.myh1}>Thông Tin Chi Tiết Đặt Hàng</h1>
      <p className={styles.subtitle}>
        Thông tin sản phẩm, phương thức liên hệ và địa chỉ của bạn
      </p>

      <div className={styles.mainContentWrapper}>
        {/* ================= Product Info ================= */}
        <section className={styles.infoBlock}>
          <h2 className={styles.myh2}>Thông Tin Sản Phẩm</h2>

          <div className={styles.infoRow}>
            <span className={styles.label}>Tên Sản Phẩm</span>
            <span className={styles.value}>{renderValue(name)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Chất Liệu</span>
            <span className={styles.value}>{renderValue(material)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Kích Thước</span>
            <span className={styles.value}>{renderValue(size)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Màu Gỗ</span>
            <span className={styles.value}>{renderValue(color)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Màu Vải</span>
            <span className={styles.value}>{renderValue(fabricColor)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Chất Liệu Vải</span>
            <span className={styles.value}>{renderValue(fabricMaterial)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Ghi Chú</span>
            <span className={styles.value}>{renderValue(note)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Số Lượng</span>
            <span className={styles.value}>{renderValue(quantity)}</span>
          </div>
        </section>

        {/* ================= Contact ================= */}
        <section className={styles.infoBlock}>
          <h2>Thông Tin Liên Hệ</h2>

          <div className={styles.infoRow}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>{renderValue(email)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Số Điện Thoại</span>
            <span className={styles.value}>{renderValue(phoneNumber)}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>SĐT Nhận Hàng</span>
            <span className={styles.value}>
              {renderValue(backupPhoneNumber)}
            </span>
          </div>
        </section>

        {/* ================= Address ================= */}
        <section className={styles.infoBlock}>
          <h2>Địa Chỉ</h2>
          <div className={styles.infoRow}>
            <span className={styles.label}>Địa Chỉ Nhận Hàng</span>
            <span className={styles.value}>{renderValue(address)}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderDetail;
