// components/ProductDetail/ProductImage.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";
import styles from "./styles/ProductDetail.module.css";
import ProductImageSkeleton from "./ProductImageSkeleton";

const IMAGE_FADE_MS = 300;

interface ProductImageProps {
  productImage: string | null;
  productTitle: string;
}

function ProductImage({ productImage, productTitle }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(productImage);
  const [imgVisible, setImgVisible] = useState(false);
  const [imgFadingOut, setImgFadingOut] = useState(false);

  useEffect(() => {
    if (!productImage || productImage === imgSrc) return;

    let cancelled = false;
    setImgFadingOut(true);
    setImgVisible(false);

    const t = setTimeout(() => {
      if (cancelled) return;
      setImgSrc(productImage);
      setImgFadingOut(false);
    }, IMAGE_FADE_MS);

    return () => {
      cancelled = true;
      clearTimeout(t);
      setImgFadingOut(false);
    };
  }, [productImage]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleImageLoad = useCallback(() => setImgVisible(true), []);

  return (
    <div className={styles.productImage}>
      <div className={styles.imageWrapper}>
        {!imgVisible && <ProductImageSkeleton />}

        {imgSrc && (
          <Image
            src={imgSrc}
            alt={productTitle}
            width={1200}
            height={675}
            priority
            onLoad={handleImageLoad}
            className={clsx(
              imgVisible && styles.show,
              imgFadingOut && styles.fadeOut,
            )}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(ProductImage);
