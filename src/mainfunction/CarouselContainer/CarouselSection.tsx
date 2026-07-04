// app/(home)/CarouselContainer/CarouselSection.tsx
import CarouselContainer from "./CarouselContainer";
import { getData } from "@/lib/getData";
import { ProductType } from "@/type/ProductType";

export default async function CarouselSection() {
  const productHero: ProductType[] = await getData("/products/hero", 300);

  if (productHero.length === 0) return null;

  return <CarouselContainer panels={productHero} />;
}
