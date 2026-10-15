// app/(home)/CarouselContainer/CarouselSection.tsx
import CarouselContainer from "./CarouselContainer";
import { getData } from "@/lib/getData";
import { ProductType } from "@/type/ProductType";
import CarouselSkeleton from "./CarouselSkeleton";

export default async function CarouselSection() {
  const productHero: ProductType[] = await getData("/products/hero", 300);
  // const productHero: ProductType[] = [];
  if (productHero.length === 0) return <CarouselSkeleton />;

  return <CarouselContainer panels={productHero} />;
}
