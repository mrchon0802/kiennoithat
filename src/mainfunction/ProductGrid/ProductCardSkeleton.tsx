// app/(home)/ProductGrid/ProductCardSkeleton.tsx
import styles from "./ProductGrid.module.css";
import skeletonStyles from "./productGridSkeleton.module.css";

export default function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.imageWrap} ${skeletonStyles.shimmer}`} />
      <div className={styles.info}>
        <div
          className={`${skeletonStyles.textLine} ${skeletonStyles.titleLine}`}
        />
        <div
          className={`${skeletonStyles.textLine} ${skeletonStyles.priceLine}`}
        />
      </div>
    </div>
  );
}
