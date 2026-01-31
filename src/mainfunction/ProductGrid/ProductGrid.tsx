"use client";

import ProductCard from "./ProductCard";
import styles from "./ProductGrid.module.css";

interface Product {
  productId: string;
  image: string;
  title: string;
  price: number;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className={styles.container}>
      <h1>Các sản phẩm nổi bật</h1>
      <section className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </section>
    </div>
  );
}
