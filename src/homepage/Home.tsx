// app/Home.tsx (hoặc app/(home)/Home.tsx tùy cấu trúc của bạn)
import { Suspense } from "react";

import BannerSection from "./banner/BannerSection";
import BannerSkeleton from "./banner/BannerSkeleton";

import CarouselSection from "./CarouselContainer/CarouselSection";
import CarouselSkeleton from "./CarouselContainer/CarouselSkeleton";

import ProductGridSection from "./ProductGrid/ProductGridSection";
import ProductGridSkeleton from "./ProductGrid/ProductGridSkeleton";

import styles from "./home.module.css";

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Suspense fallback={<BannerSkeleton />}>
        <BannerSection />
      </Suspense>

      <Suspense fallback={<CarouselSkeleton />}>
        <CarouselSection />
      </Suspense>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGridSection />
      </Suspense>
    </div>
  );
}
