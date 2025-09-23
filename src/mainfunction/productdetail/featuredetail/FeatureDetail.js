"use client";

import React, { useEffect, useState } from "react";
import PanelItem from "./CarouselPanel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import styles from "./FeatureDetail.module.css";
import { Button } from "@mui/material";

// Tách panel item ra thành một component con để dễ quản lý

function FeatureDetail({ productOption, onClose }) {
  const panels = productOption?.featureDetail || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewPortWidth, setViewPortWidth] = useState(window.innerWidth);
  const [hoverZone, setHoverZone] = useState(null);

  const handlePrev = () => {
    // Giảm index, nhưng không nhỏ hơn 0
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNext = () => {
    // Tăng index, nhưng không lớn hơn panel cuối cùng
    setCurrentIndex((prevIndex) =>
      prevIndex < panels.length - 1 ? prevIndex + 1 : panels.length - 1
    );
  };

  // Tính toán giá trị transform cho cả dải panel
  // Chiều rộng mỗi panel (880px) + margin hai bên (30px * 2)
  const panelTotalWidth = 880 + 60;
  useEffect(() => {
    const handleResize = () => {
      setViewPortWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const translatePanel =
    viewPortWidth / 2 - (currentIndex * panelTotalWidth + panelTotalWidth / 2);
  const listStyle = {
    // Di chuyển cả "thước phim" sang trái một khoảng bằng index * chiều rộng panel
    transform: `translateX(${translatePanel}px)`,
  };
  return (
    <div
      className={styles.featureDetail}
      onClick={(e) => {
        if (!e.target.closest(".panel-list")) {
          onClose?.();
        }
      }}
    >
      {/* Nút điều khiển được đặt bên ngoài */}

      {/* 1. KHUNG NHÌN: Có kích thước cố định và ẩn phần thừa */}
      <div className={styles.carouselViewport}>
        {/* 2. THƯỚC PHIM: Chứa tất cả các panel và sẽ được di chuyển */}
        <Button
          className={clsx(styles.control, styles.prevBtn)}
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
        >
          <ChevronLeft size={30} />
        </Button>
        <Button
          className={clsx(styles.control, styles.nextBtn)}
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          <ChevronRight size={30} />
        </Button>
        <div className={styles.panelList} style={listStyle}>
          {panels.map((panel, index) => {
            return (
              <PanelItem
                key={index}
                item={panel}
                currentIndex={currentIndex}
                panels={panels}
                isActive={index === currentIndex}
                onClose={onClose}
              />
            );
          })}
        </div>
        <div className={styles.carouselModalTabList}>
          <div className={styles.kdsTabList}>
            {panels.map((_, index) => (
              <div
                key={index}
                className={`dot ${currentIndex === index ? "active" : ""}`}
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

export default FeatureDetail;
