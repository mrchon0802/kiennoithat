// app/(home)/ProductGrid/ProductGridSection.tsx
import ProductGrid from "./ProductGrid";
import { getData } from "@/lib/getData";

interface Product {
  productId: string;
  image: string;
  title: string;
  price: number;
}

export default async function ProductGridSection() {
  const products: Product[] = await getData("/products", 60);

  return <ProductGrid products={products} />;
}
