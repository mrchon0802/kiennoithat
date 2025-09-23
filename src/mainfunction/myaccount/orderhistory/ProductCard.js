import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import styles from "./OrderHistory.module.css";

export default function ProductCard({ order }) {
  const { name, image, id } = order || {};
  return (
    <div className={styles.productCard}>
      <Image
        src={image}
        alt="kiennoithat"
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "130px", objectFit: "cover" }}
      />
      <div className={styles.cardContent}>
        <h3>{name || "Tên sản phẩm"}</h3>
        <section className={styles.transformDate}>
          <div className={styles.orderDate}>
            <p>Ngày Giao Hàng Dự Kiến:</p> <span>08-02-2001</span>
          </div>
        </section>
        <div className={styles.orderAction}>
          <Link
            href={`/my-account/order-history/${id}`}
            className={styles.viewDetail}
          >
            Xem Chi Tiết
          </Link>
          <Link href={"/"} className={styles.cancelOrder}>
            Hủy{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}
