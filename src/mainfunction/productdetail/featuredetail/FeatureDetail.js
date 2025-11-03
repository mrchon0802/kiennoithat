"use client";

import React, { useEffect, useState, useMemo } from "react";
import PanelItem from "./CarouselPanel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import styles from "./FeatureDetail.module.css";
import { Button } from "@mui/material";

function FeatureDetail({ onClose }) {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewPortWidth, setViewPortWidth] = useState(window.innerWidth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        if (!res.ok) {
          throw new Error("Network was bad");
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchProduct();
  }, []);

  const panels = useMemo(() => {
    return products.flatMap((p) => p.features || []) || [];
  }, [products]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < panels.length - 1 ? prevIndex + 1 : panels.length - 1
    );
  };

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
        if (!e.target.closest(styles.panelList)) {
          onClose?.();
        }
      }}
    >
      <div className={styles.carouselViewport}>
        <div className={styles.panelList} style={listStyle}>
          {panels.map((panel, index) => {
            const getPosition = (index, currentIndex, total) => {
              const diff = index - currentIndex;

              if (diff === 0) return "center";
              if (diff === -1) return "left";
              if (diff === 1) return "right";
              return "hidden";
            };
            const position = getPosition(index, currentIndex);

            return (
              <PanelItem
                key={panel._id}
                item={panel}
                currentIndex={currentIndex}
                panels={panels}
                isActive={index === currentIndex}
                onClose={onClose}
                position={position}
                onPrev={handlePrev}
                onNext={handleNext}
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
