"use client";

import React from "react";
import styles from "./styles/SizeOption.module.css";
import { ProductSize } from "@/type/ProductType";

interface Props {
  size: ProductSize;
  selectedDimensions: Record<string, number>;
  onSelect: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const LABEL_MAP: Record<string, string> = {
  width: "Rộng",
  length: "Dài",
  height: "Cao",
  depth: "Sâu",
};

function SizeOption({ size, selectedDimensions, onSelect }: Props) {
  if (!size) return null;

  const summary = Object.entries(size)
    .map(([key, dim]) => {
      if (!dim) return null;
      const value = dim.selectable
        ? dim.values[selectedDimensions[key] ?? 0]
        : dim.values[0];
      return `${LABEL_MAP[key] ?? key} ${value}m`;
    })
    .filter(Boolean)
    .join(" x ");

  return (
    <div className={styles.widthDetail}>
      <h4 className={styles.sizeTitle}>Kích thước</h4>

      {Object.entries(size).map(([key, dim]) => {
        if (!dim?.selectable) return null;

        const selectedIndex = selectedDimensions[key] ?? 0;

        return (
          <div key={key} className={styles.dimensionGroup}>
            <span className={styles.dimensionLabel}>
              {LABEL_MAP[key] ?? key}
            </span>

            <div className={styles.widthOption}>
              {dim.values.map((value, index) => (
                <button
                  key={value}
                  type="button"
                  className={index === selectedIndex ? styles.active : ""}
                  onClick={() =>
                    onSelect((prev) => ({
                      ...prev,
                      [key]: index,
                    }))
                  }
                >
                  {value} m
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {/* SUMMARY */}
      <div className={styles.totalDetail}>
        <span className={styles.totalSize}>{summary}</span>
      </div>
    </div>
  );
}

export default React.memo(SizeOption);
