// src/types/product.ts

export interface ProductSize {
  width: string[]; // ["1.4", "1.6", "1.8"]
  length: string; // "2"
  height: string; // "0.9"
}

export interface ProductColor {
  name: string;
  image: string; // material color image
  productImage: string; // product preview image
}

export interface ProductFeature {
  image: string;
  description: string;
}

export interface ProductType {
  productId: string;
  image: string;
  title: string;
  price: number;
  weight: string;
  size: ProductSize;
  colors: ProductColor[];
  features: ProductFeature[];
}
