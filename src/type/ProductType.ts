// src/types/product.ts

export interface ProductSize {
  width: number[]; // ["1.4", "1.6", "1.8"]
  length: number; // "2"
  height: number; // "0.9"
}

export interface ProductColor {
  _id: string;
  name: string;
  image: string; // material color image
  productImage: string; // product preview image
}

export interface ProductFeature {
  image: string;
  description: string;
}

export interface ProductType {
  _id: string;
  productId: string;
  image: string;
  title: string;
  price: number;
  weight: number;
  size: ProductSize;
  colors: ProductColor[];
  features: ProductFeature[];
}
