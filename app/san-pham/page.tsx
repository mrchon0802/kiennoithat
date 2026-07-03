// app/san-pham/page.tsx
import ProductGrid from "@/mainfunction/ProductGrid/ProductGrid";

interface Product {
  productId: string;
  image: string;
  title: string;
  price: number;
  room: string[];
  category: string;
}

const apiUrl =
  process.env.NEXT_PUBLIC_SERVER_API_URL || "http://localhost:5000";

interface SearchParams {
  room?: string;
  category?: string;
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${apiUrl}/products`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Fetch products failed: ${res.status}`);
  }
  return res.json();
}

// Khớp đúng giá trị "room" trong data (living-room, bed-room, kitchen, home-office)
const ROOM_LABELS: Record<string, string> = {
  "living-room": "Phòng khách",
  "bed-room": "Phòng ngủ",
  kitchen: "Phòng bếp",
  "home-office": "Phòng làm việc",
};

export default async function SanPhamPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { room, category } = await searchParams;

  const all = await getProducts();

  let filtered = all;
  if (room) {
    filtered = filtered.filter((p) => p.room.includes(room));
  }
  if (category) {
    filtered = filtered.filter((p) => p.category === category);
  }

  const title = room
    ? `Sản phẩm ${ROOM_LABELS[room] ?? room}`
    : "Tất cả sản phẩm";

  return <ProductGrid products={filtered} title={title} />;
}
