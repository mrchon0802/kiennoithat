"use client";

import React, { useMemo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Typography } from "@mui/material";
import "./styles/productDetail.css";
import SizeOption from "./SizeOption";
import ColorOption from "./ColorOption";
import Action from "./Action";
import TotalDetail from "./TotalDetail";
import { ProductType } from "@/type/ProductType";

/* ===================== TYPES ===================== */

interface ProductDetailProps {
  product: ProductType;
}

interface SelectingOrder {
  productId: string;
  name: string;
  image: string;
  width: number;
  price: number;
  size: string;
  weight: number;
  height: number;
  length: number;
  color: string;
  quantity: number;
}

/* ===================== CONSTANTS ===================== */

const WIDTH_PRICE_MULTIPLIER: Record<string, number> = {
  "1.4": 1,
  "1.6": 1.1,
  "1.8": 1.2,
};

const IMAGE_FADE_TIMEOUT = 400;

/* ===================== COMPONENT ===================== */

function ProductDetail({ product }: ProductDetailProps) {
  const [activeSelectedSize, setActiveSelectedSize] = useState(0);
  const [activeSelectedColor, setActiveSelectedColor] = useState<string | null>(
    null,
  );

  const [imageState, setImageState] = useState<{
    src: string | null;
    isFadingOut: boolean;
    loaded: boolean;
  }>({
    src: null,
    isFadingOut: false,
    loaded: false,
  });

  /* ===================== DERIVED STATE ===================== */

  const selectedWidth = useMemo<number>(() => {
    return Number(product.size.width[activeSelectedSize]);
  }, [product.size.width, activeSelectedSize]);

  const fullSize = useMemo(() => {
    const { length, height } = product.size;
    return `Dài ${length} x Rộng ${selectedWidth} x Cao ${height}`;
  }, [product.size.length, product.size.height, selectedWidth]);

  const selectedColor = useMemo(() => {
    if (!product.colors.length) return null;

    return (
      product.colors.find((c) => c._id === activeSelectedColor) ??
      product.colors[0]
    );
  }, [product.colors, activeSelectedColor]);

  const finalPrice = useMemo(() => {
    const multiplier = WIDTH_PRICE_MULTIPLIER[selectedWidth.toString()] ?? 1;
    return Math.round(product.price * multiplier);
  }, [product.price, selectedWidth]);
  const { size } = product;
  const selectingOrder = useMemo<SelectingOrder | null>(() => {
    if (!selectedColor) return null;

    return {
      productId: product._id,
      name: product.title,
      image: selectedColor.productImage,
      width: selectedWidth,
      price: finalPrice,
      size: fullSize,
      weight: product.weight,
      height: product.size.height,
      length: product.size.length,
      color: selectedColor.name,
      quantity: 1,
    };
  }, [
    product._id,
    product.title,
    product.weight,
    product.size.height,
    product.size.length,
    selectedColor,
    selectedWidth,
    finalPrice,
    fullSize,
    size,
  ]);

  /* ===================== EFFECTS ===================== */

  // set default color
  useEffect(() => {
    if (!activeSelectedColor && product.colors.length) {
      setActiveSelectedColor(product.colors[0]._id);
    }
  }, [activeSelectedColor, product.colors]);

  // image fade transition
  useEffect(() => {
    if (!selectedColor?.productImage) return;

    let cancelled = false;

    setImageState((prev) => ({
      ...prev,
      isFadingOut: true,
    }));

    const timer = setTimeout(() => {
      if (cancelled) return;

      setImageState({
        src: selectedColor.productImage,
        isFadingOut: false,
        loaded: false,
      });
    }, IMAGE_FADE_TIMEOUT);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selectedColor?.productImage]);

  /* ===================== HANDLERS ===================== */

  const handleImageLoad = useCallback(() => {
    setImageState((prev) => ({ ...prev, loaded: true }));
  }, []);

  /* ===================== RENDER ===================== */

  return (
    <div className="product-container">
      {/* IMAGE */}
      <div className="product-image">
        <div className="image-wrapper">
          {imageState.src && (
            <Image
              src={imageState.src}
              alt={product.title}
              width={1200}
              height={675}
              priority
              onLoadingComplete={handleImageLoad}
              className={`fade-img ${
                imageState.loaded ? "show" : ""
              } ${imageState.isFadingOut ? "fade-out" : ""}`}
            />
          )}
        </div>
      </div>

      {/* INFO */}
      <div className="product-info">
        <Typography variant="h4" fontWeight="bold" textAlign="center">
          {product.title}
        </Typography>

        <SizeOption
          activeSelectedSize={activeSelectedSize}
          handleWidthOptionClick={setActiveSelectedSize}
          productOption={product}
        />

        <ColorOption
          activeSelectedColor={activeSelectedColor}
          handleColorOptionClick={setActiveSelectedColor}
          productOption={product}
        />

        <TotalDetail />

        <Action finalPrice={finalPrice} selectingOrder={selectingOrder} />
      </div>
    </div>
  );
}

export default React.memo(ProductDetail);
