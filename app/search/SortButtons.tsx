"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortButtons({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSort = (value: "asc" | "desc") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        onClick={() => setSort("asc")}
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: currentSort === "asc" ? "#000" : "#fff",
          color: currentSort === "asc" ? "#fff" : "#000",
          cursor: "pointer",
        }}
      >
        Giá thấp → cao
      </button>

      <button
        onClick={() => setSort("desc")}
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: currentSort === "desc" ? "#000" : "#fff",
          color: currentSort === "desc" ? "#fff" : "#000",
          cursor: "pointer",
        }}
      >
        Giá cao → thấp
      </button>
    </div>
  );
}
