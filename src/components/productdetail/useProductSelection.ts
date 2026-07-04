// useProductSelection.ts
import { useMemo, useState, useEffect, useCallback } from "react";
import type { SelectingOrder } from "@/type/SelectingOrder";
import type { ProductType, RawSize, ProductSize } from "@/type/ProductType";

const WIDTH_PRICE_MULTIPLIER: Record<string, number> = {
  "1.2": 1,
  "1.4": 1,
  "1.6": 1.1,
  "1.8": 1.2,
  "2.0": 1.3,
};

function normalizeSize(raw: RawSize): ProductSize {
  const result: ProductSize = {};

  for (const [key, vals] of Object.entries(raw.dimensions ?? {})) {
    if (Array.isArray(vals) && vals.length > 0) {
      result[key] = { values: vals, selectable: vals.length > 1 };
    }
  }

  for (const [key, val] of Object.entries(raw.default ?? {})) {
    if (!(key in result)) {
      result[key] = { values: [val], selectable: false };
    }
  }

  return result;
}

export function useProductSelection(product: ProductType) {
  const normalizedSize = useMemo(
    () => normalizeSize(product.size),
    [product.productId], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const [selectedIdx, setSelectedIdx] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      Object.entries(normalizedSize)
        .filter(([, dim]) => dim.selectable)
        .map(([key]) => [key, 0]),
    ),
  );

  useEffect(() => {
    setSelectedIdx(
      Object.fromEntries(
        Object.entries(normalizedSize)
          .filter(([, dim]) => dim.selectable)
          .map(([key]) => [key, 0]),
      ),
    );
  }, [product.productId, normalizedSize]);

  const [activeColorId, setActiveColorId] = useState<string>(
    () => product.colors[0]?.name ?? "",
  );

  useEffect(() => {
    setActiveColorId(product.colors[0]?.name ?? "");
  }, [product.productId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedColor = useMemo(
    () =>
      product.colors.find((c) => c.name === activeColorId) ??
      product.colors[0] ??
      null,
    [product.colors, activeColorId],
  );

  const getDimValue = useCallback(
    (key: string): number => {
      const dim = normalizedSize[key];
      if (!dim) return 0;
      const idx = dim.selectable ? (selectedIdx[key] ?? 0) : 0;
      return dim.values[idx] ?? dim.values[0] ?? 0;
    },
    [normalizedSize, selectedIdx],
  );

  const fullSize = useMemo(() => {
    const parts: string[] = [];
    if (normalizedSize.length) parts.push(`Dài ${getDimValue("length")} m`);
    if (normalizedSize.width) parts.push(`Rộng ${getDimValue("width")} m`);
    if (normalizedSize.height) parts.push(`Cao ${getDimValue("height")} m`);
    if (normalizedSize.depth) parts.push(`Sâu ${getDimValue("depth")} m`);
    return parts.join(" x ");
  }, [normalizedSize, getDimValue]);

  const finalPrice = useMemo(() => {
    const widthDim = normalizedSize.width;
    if (!widthDim?.selectable) return product.price;

    const widthVal = getDimValue("width").toFixed(1);
    const multiplier = WIDTH_PRICE_MULTIPLIER[widthVal] ?? 1;
    return Math.round(product.price * multiplier);
  }, [normalizedSize.width, getDimValue, product.price]);

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

  return {
    normalizedSize,
    selectedIdx,
    setSelectedIdx,
    activeColorId,
    setActiveColorId,
    selectedColor,
    fullSize,
    finalPrice,
    selectingOrder,
  };
}
