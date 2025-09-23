"use client";

import React from "react";
import styles from "./PurchasedProductDetail.module.css";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function OrderDetail() {
  const dispatch = useDispatch();
  const params = useParams();
  const productId = params.productId;

  const currentId = useSelector((state) => state.login.currentId);

  const products = useSelector((state) => state.products.products);
  const currentProduct = products?.find(
    (p) => String(p.id) === String(productId) && p.userId === currentId
  );
  const {
    name,
    material,
    size,
    color,
    fabricColor,
    fabricMaterial,
    note,
    quanity,
    price,
  } = currentProduct || {};
  const warrantyRequest = currentProduct?.warrantyRequest;

  const warrantyContent = warrantyRequest?.content;

  return (
    <div className={styles.purchasedProductDetail}>
      <div className={styles.title}>
        <h1>Thông Tin Sản Phẩm</h1>
        <p className={styles.subtitle}>
          Quản lý thông tin sản phẩm đã mua và thời gian bảo hành
        </p>
      </div>

      <div className={styles.mainContentWrapper}>
        <div className={styles.basicInfo}>
          <section className={clsx(styles.infoBlock)}>
            <h2>Thông Tin Sản Phẩm</h2>
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
              <span className={styles.label}>Số Lượng</span>
              <span className={styles.value}>
                {quanity || "Chưa có thông tin"}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Thanh Toán</span>
              <span className={styles.value}>
                {price || "Chưa có thông tin"}
              </span>
            </div>
          </section>
        </div>

        <section className={styles.infoBlock}>
          <h2>Thông Tin Bảo Hành</h2>
          <div className={clsx(styles.editInfoRow, styles.primaryEmail)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Ngày Mua </span>
              <span className={styles.value}>{"Chưa có thông tin"}</span>
            </div>
          </div>
          <div className={clsx(styles.editInfoRow, styles.primaryPhoneNumber)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Ngày Bảo Hành</span>
              <span className={clsx(styles.value)}>{"Chưa có thông tin"}</span>
            </div>
          </div>
          <div className={clsx(styles.editInfoRow, styles.backupPhoneNumber)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Địa Chỉ Bảo Hành</span>
              <span className={clsx(styles.value)}>{"Chưa có thông tin"}</span>
            </div>
          </div>
          <div className={clsx(styles.editInfoRow, styles.backupPhoneNumber)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Yêu Cầu Bảo Hành</span>
              {warrantyRequest?.createAt ? (
                <Link
                  href={`/my-account/my-product/warranty-request`}
                  className={clsx(styles.value, styles.links)}
                >
                  {warrantyContent}
                </Link>
              ) : (
                <span className={styles.value}>Chưa có thông tin</span>
              )}
            </div>
          </div>
        </section>
      </div>
      <div className={styles.warranty}>
        <Link
          href={`/my-account/my-product/${productId}/warranty-request`}
          className={styles.warrantyBtn}
        >
          Tạo Yêu Cầu Bảo Hành
        </Link>
      </div>
    </div>
  );
}
