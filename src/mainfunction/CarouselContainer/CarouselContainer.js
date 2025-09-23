"use client";

import React, { useCallback, useEffect, useState } from "react";
import CarouselPanel from "./CarouselPanel";
import styles from "./carouselContainer.module.css";
import clsx from "clsx";

function CarouselContainer({ productOption }) {
  const panels = productOption?.mainImage || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  const translateWidth = 1024 + 20;
  const newTranslateWidth = translateWidth * 0.6;

  const calculateTranslateX = useCallback(
    (targetIndex) => {
      if (targetIndex === 0) return 0;
      let totalTranslate = 0;
      for (let i = 0; i < targetIndex; i++) {
        const isFirstStep = i === 0;
        const isNextToLastStep = i === panels.length - 2;

        const useNewWidth = isFirstStep || isNextToLastStep;
        const widthToUse = useNewWidth ? newTranslateWidth : translateWidth;

        totalTranslate += widthToUse;
      }
      return -totalTranslate;
    },
    [newTranslateWidth, panels.length, translateWidth]
  );
  useEffect(() => {
    const newTranslateX = calculateTranslateX(currentIndex);
    setTranslateX(newTranslateX);
  }, [calculateTranslateX, currentIndex]);
  const handleNextPanel = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevpanel = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1);
  };
  const handleDotClick = (targetIndex) => {
    setCurrentIndex(targetIndex);
  };
  useEffect(() => {
    console.log("Current Index:", currentIndex);
  }, [currentIndex]);
  const listStyle = {
    transform: `translateX(${translateX}px)`,
    transition: "transform 0.5s ease-in-out",
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselViewport}>
        <div className={styles.panelList} style={listStyle}>
          {panels.map((panel, index) => (
            <CarouselPanel
              key={index}
              item={panel}
              currentIndex={currentIndex}
              isActive={index === currentIndex}
              panels={panels}
              onPrev={handlePrevpanel}
              onNext={handleNextPanel}
              isPrev={index === currentIndex - 1}
              isNext={index === currentIndex + 1}
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
                  currentIndex === index && styles.active
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDotClick(index);
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarouselContainer;
