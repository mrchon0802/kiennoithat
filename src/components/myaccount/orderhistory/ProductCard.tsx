import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./OrderHistory.module.css";

interface Order {
  _id: string;
  name?: string;
  productImage: string;
  // bạn có thể mở rộng thêm field sau này
  // deliveryDate?: string;
}

interface ProductCardProps {
  order?: Order;
}

const ProductCard: React.FC<ProductCardProps> = ({ order }) => {
  if (!order) return null;

  const { name, productImage, _id } = order;

  return (
    <div className={styles.productCard}>
      <Image
        src={productImage}
        alt={name || "kiennoithat"}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "130px", objectFit: "cover" }}
      />

      <div className={styles.cardContent}>
        <h3>{name ?? "Tên sản phẩm"}</h3>

        <section className={styles.transformDate}>
          <div className={styles.orderDate}>
            <p>Ngày Giao Hàng Dự Kiến:</p>
            <span>08-02-2001</span>
          </div>
        </section>

        <div className={styles.orderAction}>
          <Link
            href={`/my-account/order-history/${_id}`}
            className={styles.viewDetail}
          >
            Xem Chi Tiết
          </Link>

          <Link href="/" className={styles.cancelOrder}>
            Hủy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
