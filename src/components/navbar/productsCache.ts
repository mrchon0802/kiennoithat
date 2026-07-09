// lib/productsCache.ts

export interface Product {
  productId: string;
  image: string;
  title: string;
  price: number;
  room: string[];
  category: string;
  type: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

let allProductsCache: Product[] | null = null;
let fetchPromise: Promise<Product[]> | null = null;

export async function fetchAllProducts(): Promise<Product[]> {
  if (allProductsCache) return allProductsCache;
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch(`${apiUrl}/products`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<Product[]>;
    })
    .then((data) => {
      allProductsCache = data;
      return data;
    });
  return fetchPromise;
}

export function getHeroProductsByRoom(all: Product[], room: string, limit = 4) {
  const byRoom = all.filter((p) => p.room.includes(room));
  const heroes = byRoom.filter((p) => p.type === "hero").slice(0, limit);
  return heroes.length ? heroes : byRoom.slice(0, limit);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + " đ";
}
