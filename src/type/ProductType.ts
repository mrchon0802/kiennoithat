// type/ProductType.ts

/* ================= RAW PRODUCT (khớp 100% với API/JSON thật) ================= */
export interface ProductColor {
  name: string;
  image: string;
  productImage: string;
}

export interface RawSize {
  dimensions: Record<string, number[]>;
  default: Record<string, number>;
}

export interface ProductType {
  productId: string;
  _id?: string;
  title: string;
  price: number;
  weight: number;
  room: string[];
  category: string;
  type: string;
  image: string;
  size: RawSize;
  colors: ProductColor[];
}

/* ================= SUMMARY (dùng cho ProductGrid/ProductCard — chỉ cần vài field) ================= */
export interface ProductSummary {
  productId: string;
  image: string;
  title: string;
  price: number;
}
