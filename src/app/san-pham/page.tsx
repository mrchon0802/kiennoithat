import ProductGrid from "@/homepage/ProductGrid/ProductGrid";
import { getData } from "@/lib/getData";

interface Product {
  productId: string;
  image: string;
  title: string;
  price: number;
  room?: string[];
  category?: string;
}

interface SearchParams {
  room?: string;
  category?: string;
}

// Khớp đúng giá trị "room" trong data.
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

  // Dùng chung cơ chế lấy dữ liệu với các trang khác trong dự án.
  // getData có retry và trả về [] nếu API lỗi, tránh làm crash toàn bộ trang.
  const all = (await getData("/products", 60)) as Product[];

  let filtered = all;
  if (room) {
    filtered = filtered.filter((product) => product.room?.includes(room));
  }
  if (category) {
    filtered = filtered.filter((product) => product.category === category);
  }

  const title = room
    ? `Sản phẩm ${ROOM_LABELS[room] ?? room}`
    : "Tất cả sản phẩm";

  return <ProductGrid products={filtered} title={title} />;
}
