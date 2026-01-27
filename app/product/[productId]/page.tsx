// app/product/[productId]/page.tsx
import ProductDetail from "@/mainfunction/productdetail/ProductDetail";
import { ProductType } from "@/type/ProductType";

const apiUrl = process.env.SERVER_API_URL ?? "http://localhost:5000";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  const res = await fetch(`${apiUrl}/products/${productId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  const product: ProductType = await res.json();

  return <ProductDetail product={product} />;
}
