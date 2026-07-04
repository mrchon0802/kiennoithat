// app/(home)/ProductGrid/ProductGridSkeleton.tsx
import styles from "./ProductGrid.module.css";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductGridSkeleton() {
  return (
    <div className={styles.container}>
      <h1>Các sản phẩm nổi bật</h1>
      <section className={styles.grid}>
        {Array.from({ length: 10 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </section>
    </div>
  );
}
