/* ================= DIMENSION ================= */
/**
 * Mỗi chiều có thể:
 * - nhiều giá trị
 * - selectable = true nếu user được chọn
 */
export interface DimensionOption {
  values: string[]; // ["1.4", "1.6", "1.8"]
  selectable: boolean; // true = cho phép chọn
}

/* ================= SIZE ================= */
export interface ProductSize {
  width: DimensionOption;
  length: DimensionOption;
  height: DimensionOption;
  depth?: DimensionOption; // dùng cho tủ, kệ
}

/* ================= COLOR ================= */
export interface ProductColor {
  _id: string;
  name: string;
  image: string; // ảnh màu / vật liệu
  productImage: string; // ảnh sản phẩm theo màu
}

/* ================= FEATURE ================= */
export interface ProductFeature {
  image: string;
  description: string;
}

/* ================= PRODUCT ================= */
export interface ProductType {
  _id: string;
  productId: string;

  title: string;
  image: string;
  price: number;
  weight: string;

  category: "bed" | "table" | "chair" | "cabinet" | "sofa" | "other";

  type: "hero" | "normal";

  size: ProductSize;
  colors: ProductColor[];
  features: ProductFeature[];

  createdAt?: string;
  updatedAt?: string;
}
