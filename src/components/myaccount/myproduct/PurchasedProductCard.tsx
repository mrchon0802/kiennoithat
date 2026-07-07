"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./MyProduct.module.css";

/* ===================== TYPES ===================== */

export interface PurchasedProduct {
  id: string;
  name?: string;
  image: string;
  purchaseDate?: string;
  userId: string;
}

/* ===================== PROPS ===================== */

interface PurchasedProductCardProps {
  product: PurchasedProduct;
}

/* ===================== COMPONENT ===================== */

const PurchasedProductCard: React.FC<PurchasedProductCardProps> = ({
  product,
}) => {
  const { id, name, image, purchaseDate } = product;

  return (
    <div className={styles.productCard}>
      <div className={styles.productCardImage}>
        <Image
          src={image}
          alt={name ?? "kiennoithat"}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.cardContent}>
        <h3>{name ?? "Tên sản phẩm"}</h3>

        <section className={styles.transformDate}>
          <div className={styles.orderDate}>
            <p>Thời Gian Bảo Hành:</p>
            <span>
              {purchaseDate
                ? new Date(purchaseDate).toLocaleDateString("vi-VN")
                : "Chưa có thông tin"}
            </span>
          </div>
        </section>

        <div className={styles.orderAction}>
          <Link
            href={`/my-account/my-product/${id}`}
            className={styles.viewDetail}
          >
            Xem Chi Tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PurchasedProductCard;
