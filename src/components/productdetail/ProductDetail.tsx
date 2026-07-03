// components/ProductDetail/ProductDetail.tsx
"use client";

import React, { useMemo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./styles/ProductDetail.module.css";
import SizeOption from "./SizeOption";
import ColorOption from "./ColorOption";
import Action from "./Action";
import TotalDetail from "./TotalDetail";
import type { SelectingOrder } from "@/type/SelectingOrder";

/* ===================== TYPES (khớp với JSON thực tế) ===================== */

interface ProductColor {
  _id?: string;
  name: string;
  image: string;
  productImage: string;
}

interface RawSize {
  dimensions: Record<string, number[]>; // vd: { width: [1.6, 1.8] }
  default: Record<string, number>; // vd: { length: 2.0, height: 1.0 }
}

export interface ProductRaw {
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

/* ===================== CONSTANTS ===================== */

// Giá nhân theo chiều rộng (chỉ áp dụng khi width có nhiều lựa chọn)
const WIDTH_PRICE_MULTIPLIER: Record<string, number> = {
  "1.2": 1,
  "1.4": 1,
  "1.6": 1.1,
  "1.8": 1.2,
  "2.0": 1.3,
};

const IMAGE_FADE_MS = 300;

/* ===================== HELPERS ===================== */

/**
 * Normalize size JSON → cấu trúc chuẩn để dùng trong component.
 *
 * JSON shape:
 *   dimensions: { width: [1.6, 1.8] }   ← selectable nếu có >1 giá trị
 *   default:    { length: 2.0, height: 1.0, width?: 1.2 }  ← fixed value
 *
 * Output shape:
 *   { width: { values: [1.6, 1.8], selectable: true },
 *     length: { values: [2.0],     selectable: false },
 *     height: { values: [1.0],     selectable: false } }
 */
function normalizeSize(
  raw: RawSize,
): Record<string, { values: number[]; selectable: boolean }> {
  const result: Record<string, { values: number[]; selectable: boolean }> = {};

  // 1. Các dimension có trong `dimensions` (có thể selectable)
  for (const [key, vals] of Object.entries(raw.dimensions ?? {})) {
    if (Array.isArray(vals) && vals.length > 0) {
      result[key] = {
        values: vals,
        selectable: vals.length > 1,
      };
    }
  }

  // 2. Các dimension có trong `default` mà chưa có trong dimensions
  for (const [key, val] of Object.entries(raw.default ?? {})) {
    if (!(key in result)) {
      result[key] = {
        values: [val],
        selectable: false,
      };
    }
  }

  return result;
}

function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + " đ";
}

/* ===================== COMPONENT ===================== */

interface ProductDetailProps {
  product: ProductRaw;
}

function ProductDetail({ product }: ProductDetailProps) {
  /* ── Normalize size 1 lần ─────────────────────────────────── */
  const normalizedSize = useMemo(
    () => normalizeSize(product.size),
    [product.productId], // eslint-disable-line react-hooks/exhaustive-deps
  );

  /* ── Selected dimension indices ───────────────────────────── */
  const [selectedIdx, setSelectedIdx] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      Object.entries(normalizedSize)
        .filter(([, dim]) => dim.selectable)
        .map(([key]) => [key, 0]),
    ),
  );

  // Reset khi đổi sản phẩm
  useEffect(() => {
    setSelectedIdx(
      Object.fromEntries(
        Object.entries(normalizedSize)
          .filter(([, dim]) => dim.selectable)
          .map(([key]) => [key, 0]),
      ),
    );
  }, [product.productId, normalizedSize]);

  /* ── Color ────────────────────────────────────────────────── */
  const [activeColorId, setActiveColorId] = useState<string>(
    () => product.colors[0]?._id ?? product.colors[0]?.name ?? "",
  );

  useEffect(() => {
    setActiveColorId(product.colors[0]?._id ?? product.colors[0]?.name ?? "");
  }, [product.productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedColor = useMemo(
    () =>
      product.colors.find((c) => (c._id ?? c.name) === activeColorId) ??
      product.colors[0] ??
      null,
    [product.colors, activeColorId],
  );

  /* ── Image fade ───────────────────────────────────────────── */
  const [imgSrc, setImgSrc] = useState<string | null>(
    () => product.colors[0]?.productImage ?? product.image ?? null,
  );
  const [imgVisible, setImgVisible] = useState(false);
  const [imgFadingOut, setImgFadingOut] = useState(false);

  useEffect(() => {
    const nextSrc = selectedColor?.productImage;
    if (!nextSrc || nextSrc === imgSrc) return;

    let cancelled = false;
    setImgFadingOut(true);
    setImgVisible(false);

    const t = setTimeout(() => {
      if (cancelled) return;
      setImgSrc(nextSrc);
      setImgFadingOut(false);
    }, IMAGE_FADE_MS);

    return () => {
      cancelled = true;
      clearTimeout(t);
      setImgFadingOut(false);
    };
  }, [selectedColor?.productImage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageLoad = useCallback(() => setImgVisible(true), []);

  /* ── Get value of a dimension by key ─────────────────────── */
  const getDimValue = useCallback(
    (key: string): number => {
      const dim = normalizedSize[key];
      if (!dim) return 0;
      const idx = dim.selectable ? (selectedIdx[key] ?? 0) : 0;
      return dim.values[idx] ?? dim.values[0] ?? 0;
    },
    [normalizedSize, selectedIdx],
  );

  /* ── Display size string ──────────────────────────────────── */
  const fullSize = useMemo(() => {
    const parts: string[] = [];
    if (normalizedSize.length) parts.push(`Dài ${getDimValue("length")} m`);
    if (normalizedSize.width) parts.push(`Rộng ${getDimValue("width")} m`);
    if (normalizedSize.height) parts.push(`Cao ${getDimValue("height")} m`);
    if (normalizedSize.depth) parts.push(`Sâu ${getDimValue("depth")} m`);
    return parts.join(" x ");
  }, [normalizedSize, getDimValue]);

  /* ── Price (nhân theo width nếu selectable) ───────────────── */
  const finalPrice = useMemo(() => {
    const widthDim = normalizedSize.width;
    if (!widthDim?.selectable) return product.price; // fixed width → giá gốc

    const widthVal = getDimValue("width").toFixed(1);
    const multiplier = WIDTH_PRICE_MULTIPLIER[widthVal] ?? 1;
    return Math.round(product.price * multiplier);
  }, [normalizedSize.width, getDimValue, product.price]);

  /* ── Order object ─────────────────────────────────────────── */
  const selectingOrder = useMemo<SelectingOrder | null>(() => {
    if (!selectedColor) return null;
    return {
      productId: product._id ?? product.productId,
      name: product.title,
      price: finalPrice,
      size: fullSize,
      weight: Number(product.weight) || 0,
      width: getDimValue("width"),
      height: getDimValue("height"),
      length: getDimValue("length"),
      color: selectedColor.name,
      quantity: 1,
    };
  }, [
    product._id,
    product.productId,
    product.title,
    product.weight,
    selectedColor,
    finalPrice,
    fullSize,
    getDimValue,
  ]);

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className={styles.productContainer}>
      <div className={styles.productWrapper}>
        {/* IMAGE */}
        <div className={styles.productImage}>
          <div className={styles.imageWrapper}>
            {imgSrc && (
              <Image
                src={imgSrc}
                alt={product.title}
                width={1200}
                height={675}
                priority
                onLoad={handleImageLoad}
                className={[
                  "fade-img",
                  imgVisible ? "show" : "",
                  imgFadingOut ? "fade-out" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            )}
          </div>
        </div>

        {/* INFO */}
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
