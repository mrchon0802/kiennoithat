import Image from "next/image";
import styles from "./ProductGrid.module.css";
import Link from "next/link";

interface Product {
  productId: string;
  image: string;
  title: string;
  price: number;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>
          {product.price.toLocaleString("vi-VN")} ₫
        </p>
      </div>
    </div>
  );
}
