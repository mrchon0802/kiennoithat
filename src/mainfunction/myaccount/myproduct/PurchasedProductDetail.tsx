"use client";

import React, { useMemo } from "react";
import styles from "./PurchasedProductDetail.module.css";
import clsx from "clsx";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";

export default function PurchasedProductDetail() {
  const router = useRouter();
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;

  // 👤 user hiện tại
  const currentUserId = useSelector(
    (state: RootState) => state.login.user?._id,
  );

  // 📦 products
  const products = useSelector((state: RootState) => state.products.products);

  /**
   * 🔍 tìm sản phẩm thuộc user hiện tại
   */
  const currentProduct = useMemo(() => {
    if (!productId || !currentUserId) return undefined;

    return products.find(
      (p) => p.id === productId && p.userId === currentUserId,
    );
  }, [products, productId, currentUserId]);

  // Guard: không có product → quay về list
  if (!currentProduct) {
    return (
      <div className={styles.purchasedProductDetail}>
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const {
    name,
    material,
    size,
    color,
    fabricColor,
    fabricMaterial,
    quantity,
    price,
    warrantyRequest,
  } = currentProduct;

  return (
    <div className={styles.purchasedProductDetail}>
      {/* ===== Header ===== */}
      <div className={styles.title}>
        <h1>Thông Tin Sản Phẩm</h1>
        <p className={styles.subtitle}>
          Quản lý thông tin sản phẩm đã mua và thời gian bảo hành
        </p>
      </div>

      <div className={styles.mainContentWrapper}>
        {/* ===== Product Info ===== */}
        <section className={styles.infoBlock}>
          <h2>Thông Tin Sản Phẩm</h2>

          <InfoRow label="Tên Sản Phẩm" value={name} />
          <InfoRow label="Chất Liệu" value={material} />
          <InfoRow label="Kích Thước" value={size} />
          <InfoRow label="Màu Gỗ" value={color} />
          <InfoRow label="Màu Vải" value={fabricColor} />
          <InfoRow label="Chất Liệu Vải" value={fabricMaterial} />
          <InfoRow label="Số Lượng" value={quantity?.toString()} />
          <InfoRow label="Thanh Toán" value={price?.toLocaleString("vi-VN")} />
        </section>

        {/* ===== Warranty Info ===== */}
        <section className={styles.infoBlock}>
          <h2>Thông Tin Bảo Hành</h2>

          <InfoRow label="Ngày Mua" value="Chưa có thông tin" />
          <InfoRow label="Ngày Bảo Hành" value="Chưa có thông tin" />
          <InfoRow label="Địa Chỉ Bảo Hành" value="Chưa có thông tin" />

          <div className={styles.infoRow}>
            <span className={styles.label}>Yêu Cầu Bảo Hành</span>

            {warrantyRequest?.createdAt ? (
              <Link
                href={`/my-account/my-product/${productId}/warranty-request`}
                className={clsx(styles.value, styles.links)}
              >
                {warrantyRequest.content}
              </Link>
            ) : (
              <span className={styles.value}>Chưa có thông tin</span>
            )}
          </div>
        </section>
      </div>

      {/* ===== Action ===== */}
      <div className={styles.warranty}>
        <Link
          href={`/my-account/my-product/${productId}/warranty-request`}
          className={styles.warrantyBtn}
        >
          {warrantyRequest
            ? "Chỉnh Sửa Yêu Cầu Bảo Hành"
            : "Tạo Yêu Cầu Bảo Hành"}
        </Link>
      </div>
    </div>
  );
}

/* ===================== HELPER COMPONENT ===================== */

interface InfoRowProps {
  label: string;
  value?: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value || "Chưa có thông tin"}</span>
    </div>
  );
}
