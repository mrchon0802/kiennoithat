"use client";

import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";
import Link from "next/link";

interface Product {
  productId: string;
  image: string;
  title: string;
  price: number;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({
  products,
  title = "Các sản phẩm nổi bật",
}: ProductGridProps) {
  return (
    <div className={styles.container}>
      <h1>{title}</h1>
      {products.length > 0 ? (
        <section className={styles.grid}>
          {products.map((product) => (
            <Link
              key={product.productId}
              href={`/product/${product.productId}`}
              className={styles.cardLink}
            >
              <ProductCard product={product} />
            </Link>
          ))}
        </section>
      ) : (
        <p className={styles.emptyNote}>Chưa có sản phẩm nào.</p>
      )}
    </div>
  );
}
