import SearchGrid from "@/components/SearchBox/SearchGrid";
import SortButtons from "./SortButtons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const { q, sort } = await searchParams;
  const keyword = q?.trim() || "";

  if (!keyword) return <p>Không có từ khóa tìm kiếm</p>;

  const res = await fetch(
    `${API_URL}/products/search?q=${encodeURIComponent(keyword)}`,
    { cache: "no-store" },
  );

  let products = res.ok ? await res.json() : [];

  // 🔥 SORT GIÁ
  if (sort === "asc") {
    products.sort((a: any, b: any) => a.price - b.price);
  }

  if (sort === "desc") {
    products.sort((a: any, b: any) => b.price - a.price);
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 0" }}>
      {/* header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>Kết quả tìm kiếm cho “{keyword}”</h2>
        <SortButtons currentSort={sort} />
      </div>

      <SearchGrid products={products} />
    </div>
  );
}
