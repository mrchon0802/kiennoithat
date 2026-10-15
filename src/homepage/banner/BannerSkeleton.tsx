// app/(home)/banner/BannerSkeleton.tsx
import styles from "./homepageHeroSlide.module.css";
import skeletonStyles from "./bannerSkeleton.module.css";

export default function BannerSkeleton() {
  return (
    <div className={styles.homepageHeroSlide}>
      <div className={styles.carouselViewport}>
        <div className={`${styles.panelList} ${skeletonStyles.shimmer}`} />

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
