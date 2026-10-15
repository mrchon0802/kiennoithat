// app/(home)/ProductGrid/ProductGridSection.tsx
import ProductGrid from "./ProductGrid";
import { getData } from "@/lib/getData";
import ProductGridSkeleton from "./ProductGridSkeleton";

interface Product {
  productId: string;
  image: string;
  title: string;
  price: number;
}

export default async function ProductGridSection() {
  const products: Product[] = await getData("/products", 60);
  // const products: Product[] = [];
  if (products.length === 0) return <ProductGridSkeleton />;
  return <ProductGrid products={products} />;
}
