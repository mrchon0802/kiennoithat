// ProductDetail.tsx
"use client";

import React from "react";
import styles from "./styles/ProductDetail.module.css";
import ProductImage from "./ProductImage";
import SizeOption from "./SizeOption";
import ColorOption from "./ColorOption";
import Action from "./Action";
import TotalDetail from "./TotalDetail";
import { useProductSelection } from "./useProductSelection";
import type { ProductType } from "@/type/ProductType";

interface ProductDetailProps {
  product: ProductType;
}

function ProductDetail({ product }: ProductDetailProps) {
  const {
    normalizedSize,
    selectedIdx,
    setSelectedIdx,
    activeColorId,
    setActiveColorId,
    selectedColor,
    finalPrice,
    selectingOrder,
  } = useProductSelection(product);

  return (
    <div className={styles.productContainer}>
      <div className={styles.productWrapper}>
        <ProductImage
          productImage={selectedColor?.productImage ?? product.image}
          productTitle={product.title}
        />

        <div className={styles.productInfo}>
          <h1 className={styles.productTitle}>{product.title}</h1>

          <SizeOption
            size={normalizedSize}
            selectedDimensions={selectedIdx}
            onSelect={setSelectedIdx}
          />

          <ColorOption
            activeSelectedColor={activeColorId}
            handleColorOptionClick={setActiveColorId}
            productOption={product}
          />

          <TotalDetail />
        </div>
      </div>

      <Action
        finalPrice={finalPrice}
        selectingOrder={selectingOrder}
        productTitle={product.title}
      />
    </div>
  );
}

export default React.memo(ProductDetail);
