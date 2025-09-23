"use client";

import React from "react";
import styles from "./OrderDetail.module.css";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function OrderDetail() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const orderId = params.orderId;

  const users = useSelector((state) => state.users.users);
  const currentId = useSelector((state) => state.login.currentId);
  const currentUser = users?.find((u) => u.id === currentId) || {};

  const {
    email = "",
    phoneNumber = "",
    backupPhoneNumber = "",
    address = "",
  } = currentUser || {};

  const orders = useSelector((state) => state.orders.orders);
  const currentOrder = orders.find(
    (o) => String(o.id) === String(orderId) && o.userId === currentId
  );
  const {
    name,
    material,
    size,
    color,
    fabricColor,
    fabricMaterial,
    note,
    quantity,
    price,
  } = currentOrder || {};

  return (
    <div className={styles.orderDetail}>
      <h1 className={styles.myh1}>Thông Tin Chi Tiết Đặt Hàng</h1>
      <p className={styles.subtitle}>
        Thông tin sản phẩm, phương thức liên hệ và địa chỉ của bạn
      </p>
      <div className={styles.mainContentWrapper}>
        <div className={styles.basicInfo}>
          <section className={clsx(styles.infoBlock)}>
            <h2 className={styles.myh2}>Thông Tin Sản Phẩm</h2>
            <div className={styles.infoRow}>
              <span className={styles.label}>Tên Sản Phẩm</span>
              <span className={styles.value}>
                {name || "Chưa có thông tin"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Chất Liệu</span>
              <span className={styles.value}>
                {material || "Chưa có thông tin"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Kích Thước</span>
              <span className={styles.value}>
                {size || "Chưa có thông tin"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Màu Gỗ</span>
              <span className={styles.value}>
                {color || "Chưa có thông tin"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Màu Vải</span>
              <span className={styles.value}>
                {fabricColor || "Chưa có thông tin"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Chất Liệu Vải</span>
              <span className={styles.value}>
                {fabricMaterial || "Chưa có thông tin"}
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Ghi Chú Bổ Sung</span>
              <span className={styles.value}>
                {note || "Chưa có thông tin"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Số Lượng</span>
              <span className={styles.value}>
                {quantity || "Chưa có thông tin"}
              </span>
            </div>
          </section>
        </div>

        <section className={styles.infoBlock}>
          <h2>Thông Tin Liên Hệ</h2>
          <div className={clsx(styles.editInfoRow, styles.primaryEmail)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email </span>
              <span className={styles.value}>
                {email || "Chưa có thông tin"}
              </span>
            </div>
          </div>
          <div className={clsx(styles.editInfoRow, styles.primaryPhoneNumber)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Số Điện Thoại</span>
              <span className={clsx(styles.value)}>
                {phoneNumber || "Chưa có thông tin"}
              </span>
            </div>
          </div>
          <div className={clsx(styles.editInfoRow, styles.backupPhoneNumber)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Số Điện Thoại Nhận Hàng</span>
              <span className={clsx(styles.value)}>
                {backupPhoneNumber || "Chưa có thông tin"}
              </span>
            </div>
          </div>
        </section>

        <section className={styles.infoBlock}>
          <h2>Địa chỉ</h2>
          <div className={clsx(styles.editInfoRow, styles.mailing)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Địa Chỉ Nhận Hàng</span>
              <span className={clsx(styles.value)}>
                {address || "Chưa có thông tin"}
              </span>
            </div>
          </div>
        </section>
        <section className={styles.infoBlock}>
          <h2>Thời Gian Đặt Hàng</h2>
          <div className={clsx(styles.editInfoRow, styles.mailing)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Thời Gian Đặt Hàng</span>
              <span className={clsx(styles.value)}>
                {address || "Chưa có thông tin"}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
