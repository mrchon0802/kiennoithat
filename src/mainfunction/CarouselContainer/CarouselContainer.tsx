"use client";

import React, { useCallback, useEffect, useState } from "react";
import CarouselPanel from "./CarouselPanel";
import styles from "./carouselContainer.module.css";
import clsx from "clsx";
import { ProductType } from "@/type/ProductType";

interface CarouselContainerProps {
  panels: ProductType[];
}

export default function CarouselContainer({ panels }: CarouselContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const translateWidth = 1024 + 20;
  const newTranslateWidth = translateWidth * 0.6;

  const calculateTranslateX = useCallback(
    (targetIndex: number) => {
      if (targetIndex === 0) return 0;

      let total = 0;
      for (let i = 0; i < targetIndex; i++) {
        const useNewWidth = i === 0 || i === panels.length - 2;
        total += useNewWidth ? newTranslateWidth : translateWidth;
      }
      return -total;
    },
    [newTranslateWidth, panels.length, translateWidth],
  );

  useEffect(() => {
    setTranslateX(calculateTranslateX(currentIndex));
  }, [calculateTranslateX, currentIndex]);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselViewport}>
        <div
          className={styles.panelList}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {panels.map((panel, index) => (
            <CarouselPanel
              key={panel.productId}
              item={panel}
              isActive={index === currentIndex}
              isPrev={index === currentIndex - 1}
              isNext={index === currentIndex + 1}
              onPrev={() => setCurrentIndex((i) => i - 1)}
              onNext={() => setCurrentIndex((i) => i + 1)}
            />
          ))}
        </div>

        <div className={styles.carouselModalTabList}>
          <div className={styles.kdsTabList}>
            {panels.map((_, index) => (
              <div
                key={index}
                className={clsx(
                  styles.dot,
                  index === currentIndex && styles.active,
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
