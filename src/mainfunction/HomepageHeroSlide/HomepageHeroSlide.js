"use client";

import React, { useEffect, useState } from "react";
import CarouselPanel from "./CarouselPanel";
import styles from "./homepageHeroSlide.module.css";
import clsx from "clsx";
import { ChevronRight, ChevronLeft } from "lucide-react";

function HomepageHeroSlide({ productOption }) {
  const panels = productOption.hero || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetTimer, setResetTimer] = useState(0);

  const handlePrevBtn = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? panels.length - 1 : prevIndex - 1;
      console.log("Prev ->", newIndex);
      return newIndex;
    });
    setResetTimer((t) => t + 1);
  };
  const handleNextBtn = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === panels.length - 1 ? 0 : prevIndex + 1
    );
    setResetTimer((t) => t + 1);
  };
  useEffect(() => {
    if (panels.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % panels.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [panels.length, resetTimer]);
  return (
    <div className={styles.homepageHeroSlide}>
      <div className={styles.carouselViewport}>
        <div className={styles.panelList}>
          {panels.map((item, index) => (
            <div
              key={item.id || index}
              className={clsx(
                styles.productCardHeroSlide,
                index === currentIndex && styles.active
              )}
            >
              <CarouselPanel
                key={item.id || index}
                item={item}
                isActive={index === currentIndex}
              />
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
                  currentIndex === index && styles.active
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomepageHeroSlide;
