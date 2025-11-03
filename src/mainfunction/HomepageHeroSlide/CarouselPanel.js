import React from "react";
import styles from "./homepageHeroSlide.module.css";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

function CarouselPanel({ isActive, item, heroProduct }) {
  if (!item) return null;
  const { image, title, buttons, description = [] } = item;
  return (
    <div
      className={clsx(
        styles.productCardHeroSlide,
        isActive ? styles.active : styles.inActive
      )}
    >
      <div className={styles.reactImage}>
        <Image src={image} alt={title || ""} height={675} width={1920} />
      </div>
      <div className={styles.moduleContent}>
        <div className={styles.slideTitle}>
          <h1>{title}</h1>
        </div>
        <div className={styles.componentHeading}>
          <span>{description}</span>
        </div>

        <div className={styles.buttonGroup}>
          {Array.isArray(item.buttons) && item.buttons.length > 0 ? (
            buttons?.map((btn, index) => (
              <Link
                key={index}
                href={btn.link}
                className={clsx(
                  btn.label === "Mua Ngay" && styles.orderNowBtn,
                  btn.label === "View Detail" && styles.viewDetailBtn
                )}
              >
                {btn.label}
              </Link>
            ))
          ) : (
            <p style={{ color: "red" }}>No buttons</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default CarouselPanel;
