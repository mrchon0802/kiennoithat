// app/(home)/CarouselContainer/CarouselSkeleton.tsx
import styles from "./carouselContainer.module.css";
import skeletonStyles from "./carouselSkeleton.module.css";

export default function CarouselSkeleton() {
  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselViewport}>
        <div className={styles.panelList}>
          <div
            className={`${styles.productCardCarouselSlide} ${skeletonStyles.shimmer}`}
          />
        </div>

        <div className={styles.carouselModalTabList}>
          <div className={styles.kdsTabList}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={skeletonStyles.dotSkeleton} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
