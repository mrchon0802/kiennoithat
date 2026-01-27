"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import styles from "./carouselContainer.module.css";
import { ProductType } from "@/type/ProductType";

interface CarouselPanelProps {
  item: ProductType;
  isActive: boolean;
  isPrev: boolean;
  isNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

const CarouselPanel: React.FC<CarouselPanelProps> = ({
  item,
  isActive,
  isPrev,
  isNext,
  onPrev,
  onNext,
}) => {
  const handleClick = () => {
    if (isPrev) onPrev();
    if (isNext) onNext();
  };

  const { image, title, productId } = item;

  return (
    <div
      className={clsx(
        styles.productCardCarouselSlide,
        isActive ? styles.active : styles.inActive,
        isPrev && styles.prev,
        isNext && styles.next,
      )}
      onClick={!isActive ? handleClick : undefined}
      style={{ cursor: isActive ? "default" : "pointer" }}
    >
      <div className={styles.reactImage}>
        <Image
          src={image}
          alt={title}
          width={1024}
          height={580}
          priority={isActive}
        />
      </div>

      <div className={styles.moduleContent}>
        <div className={styles.slideTitle}>
          <h1>{title}</h1>
        </div>

        <div
          className={styles.buttonGroup}
          onClick={(e) => e.stopPropagation()}
        >
          <Link href={`product/${productId}`} className={styles.orderNowBtn}>
            Mua ngay
          </Link>

          <button className={styles.learnMoreBtn}>Learn more</button>
        </div>
      </div>
    </div>
  );
};

export default CarouselPanel;
