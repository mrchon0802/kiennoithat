"use client";

import React, { useEffect, useState } from "react";
import CarouselPanel from "./CarouselPanel";
import styles from "./homepageHeroSlide.module.css";
import clsx from "clsx";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { BannerItem } from "../../type/BannerType";

type BannerProps = {
  panels: BannerItem[];
};

function Banner({ panels }: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetTimer, setResetTimer] = useState(0);

  const handlePrevBtn = () => {
    setCurrentIndex((prev) => (prev === 0 ? panels.length - 1 : prev - 1));
    setResetTimer((t) => t + 1);
  };

  const handleNextBtn = () => {
    setCurrentIndex((prev) => (prev === panels.length - 1 ? 0 : prev + 1));
    setResetTimer((t) => t + 1);
  };

  useEffect(() => {
    if (panels.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % panels.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [panels.length, resetTimer]);

  if (panels.length === 0) return null;

  return (
    <div className={styles.homepageHeroSlide}>
      <div className={styles.carouselViewport}>
        <div className={styles.panelList}>
          {panels.map((item, index) => (
            <div
              key={item.title}
              className={clsx(
                styles.productCardHeroSlide,
                index === currentIndex && styles.active,
              )}
            >
              <CarouselPanel item={item} isActive={index === currentIndex} />
            </div>
          ))}
        </div>

        <button
          onClick={handlePrevBtn}
          className={clsx(styles.control, styles.prevBtn)}
        >
          <ChevronLeft size={30} />
        </button>

        <button
          onClick={handleNextBtn}
          className={clsx(styles.control, styles.nextBtn)}
        >
          <ChevronRight size={30} />
        </button>

        <div className={styles.carouselModalTabList}>
          <div className={styles.kdsTabList}>
            {panels.map((_, index) => (
              <div
                key={index}
                className={clsx(
                  styles.dot,
                  currentIndex === index && styles.active,
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
