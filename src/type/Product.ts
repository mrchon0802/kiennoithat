export type WarrantyStatus = "pending" | "approved" | "rejected";

export interface WarrantyRequest {
  id: string;
  content: string;
  status: WarrantyStatus;
  createdAt: string;
}

export interface PurchasedProduct {
  id: string;
  userId: string;

  // dữ liệu sản phẩm (merge từ payload)
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;

  material: string; // Thêm trường này
  fabricColor: string; // Thêm trường này (dựa trên ảnh lỗi có dòng này)
  fabricMaterial: string; // Thêm trường này (dựa trên ảnh lỗi có dòng này)
  // -----------------------

  quantity: number;

  purchaseDate: string;
  warrantyRequest: WarrantyRequest | null;
}

export interface PurchasedProductState {
  products: PurchasedProduct[];
}
