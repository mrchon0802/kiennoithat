import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import styles from "./MyProduct.module.css";
import Image from "next/image";

export default function PurchasedProductCard({ product }) {
  const { name, image, purchaseDate, id } = product || {};

  return (
    <div className={styles.productCard}>
      <div className={styles.productCardImage}>
        <Image
          src={image}
          alt="kiennoithat"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className={styles.cardContent}>
        <h3>{name || "Tên sản phẩm"}</h3>
        <section className={styles.transformDate}>
          <div className={styles.orderDate}>
            <p>Thời Gian Bảo Hành:</p>
            <span>
              {purchaseDate
                ? new Date(purchaseDate).toLocaleDateString()
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
}
