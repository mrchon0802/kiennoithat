"use client";

import React from "react";
import styles from "./homepageHeroSlide.module.css";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { BannerItem } from "../../type/BannerType";

type CarouselPanelProps = {
  item: BannerItem;
  isActive: boolean;
  heroProduct?: boolean; // giữ lại nếu sau này dùng
};

const CarouselPanel: React.FC<CarouselPanelProps> = ({
  item,
  isActive,
  heroProduct,
}) => {
  const { image, title, buttons = [], description } = item;

  return (
    <div
      className={clsx(
        styles.productCardHeroSlide,
        isActive ? styles.active : styles.inActive,
      )}
    >
      <div className={styles.reactImage}>
        <Image
          src={image}
          alt={title ?? "Banner image"}
          width={1920}
          height={675}
          priority={isActive}
        />
      </div>

      <div className={styles.moduleContent}>
        {title && (
          <div className={styles.slideTitle}>
            <h1>{title}</h1>
          </div>
        )}

        {description && (
          <div className={styles.componentHeading}>
            <span>{description}</span>
          </div>
        )}

        <div className={styles.buttonGroup}>
          {buttons.length > 0 ? (
            buttons.map((btn) => (
              <Link
                key={btn.label}
                href={`/product${btn.link}`}
                className={clsx(
                  btn.label === "Mua Ngay" && styles.orderNowBtn,
                  btn.label === "View Detail" && styles.viewDetailBtn,
                )}
              >
                {btn.label}
              </Link>
            ))
          ) : (
            <p className={styles.noButton}>No buttons</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarouselPanel;
