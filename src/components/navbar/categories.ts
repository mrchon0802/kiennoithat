// components/NavBar/categories.ts

export interface NavCategory {
  label: string;
  slug: string; // dùng cho URL: /san-pham?room=...
  room: string; // khớp với field "room" trong product.json
}

// components/NavBar/categories.ts
export const PRODUCT_CATEGORIES = [
  { label: "Phòng khách", slug: "phong-khach", room: "living-room" },
  { label: "Phòng ngủ", slug: "phong-ngu", room: "bed-room" },
  { label: "Phòng bếp", slug: "phong-bep", room: "kitchen" },
  { label: "Phòng làm việc", slug: "phong-lam-viec", room: "home-office" },
] as const;
