"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const panelListRef = useRef<HTMLDivElement>(null);
  const gap = 20;

  const calculateTranslateX = useCallback(
    (targetIndex: number) => {
      const viewport = viewportRef.current;
      const panelList = panelListRef.current;
      const targetPanel = panelRefs.current[targetIndex];
      if (!viewport || !panelList || !targetPanel) return 0;

      const style = getComputedStyle(viewport);
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      const visibleWidth = viewport.clientWidth - paddingLeft - paddingRight;

      const totalWidth = panelList.scrollWidth;
      const maxTranslate = Math.max(0, totalWidth - visibleWidth);

      // Tổng width (+ gap) của các panel đứng trước targetIndex
      let offsetBefore = 0;
      for (let i = 0; i < targetIndex; i++) {
        offsetBefore += (panelRefs.current[i]?.offsetWidth ?? 0) + gap;
      }

      const targetWidth = targetPanel.offsetWidth;

      // Canh panel active vào giữa viewport
      const centered = offsetBefore - (visibleWidth - targetWidth) / 2;

      // Clamp: không cho vượt quá 2 biên [0, maxTranslate]
      // -> tự động xử lý đúng cả 2 trạng thái đầu/cuối
      const clamped = Math.min(Math.max(centered, 0), maxTranslate);

      return -clamped;
    },
    [gap],
  );

  const recalculate = useCallback(() => {
    setTranslateX(calculateTranslateX(currentIndex));
  }, [calculateTranslateX, currentIndex]);

  useLayoutEffect(() => {
    recalculate();
  }, [recalculate]);

  useEffect(() => {
    window.addEventListener("resize", recalculate);
    return () => window.removeEventListener("resize", recalculate);
  }, [recalculate]);

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselViewport} ref={viewportRef}>
        <div
          className={styles.panelList}
          ref={panelListRef}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {panels.map((panel, index) => (
            <CarouselPanel
              key={panel.productId}
              ref={(el) => {
                panelRefs.current[index] = el;
              }}
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
