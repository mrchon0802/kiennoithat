"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import ProductDetail from "../productdetail/ProductDetail";
import styles from "./carouselContainer.module.css";
import clsx from "clsx";

function CarouselPanel({ item, isActive, isPrev, isNext, onPrev, onNext }) {
  const handleClick = () => {
    if (isPrev) onPrev();
    if (isNext) onNext();
  };
  return (
    <div
      className={clsx(
        styles.productCardCarouselSlide,
        isActive ? styles.active : styles.inActive,
        isPrev && styles.prev,
        isNext && styles.next
      )}
      onClick={!isActive ? handleClick : undefined}
      style={{ cursor: isActive ? "default" : "pointer" }}
    >
      <div className={styles.reactImage}>
        <Image src={item.src} alt="" fill />
      </div>
      <div className={styles.moduleContent}>
        <div className={styles.slideTitle}>
          <h1>{item.title}</h1>
        </div>
        <div className={styles.componentHeading}></div>
        <div
          className={styles.buttonGroup}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.orderNowBtn}>
            <Link href={`/product/${item.productId}`}>Mua ngay</Link>
          </button>

          <button className={styles.learnMoreBtn}>Learn more</button>
        </div>
      </div>
    </div>
  );
}
export default CarouselPanel;
