"use client";

import React from "react";
import styles from "./styles/ColorOption.module.css";

interface ProductColor {
  name: string;
  image: string;
  productImage: string;
}

interface ColorOptionProps {
  activeSelectedColor: string;
  productOption: { colors: ProductColor[] };
  handleColorOptionClick: (name: string) => void;
}

export default function ColorOption({
  activeSelectedColor,
  productOption,
  handleColorOptionClick,
}: ColorOptionProps) {
  if (!productOption || !productOption?.colors) return null;

  const selectionColor = productOption.colors.find(
    (option) => option.name === activeSelectedColor,
  );

  return (
    <div>
      {/* Tên màu đang chọn */}
      <div className={styles.colorHeader}>
        <span className={styles.colorTitle}>
          Màu gỗ:
          {selectionColor && (
            <span className={styles.colorName}> {selectionColor.name}</span>
          )}
        </span>
      </div>

      {/* Danh sách màu */}
      <div className={styles.colorOption}>
        {productOption.colors.map((color) => (
          <button
            key={color.name}
            type="button"
            className={activeSelectedColor === color.name ? styles.active : ""}
            onClick={() => handleColorOptionClick(color.name)}
          >
            <img src={color.image} alt={color.name} />
          </button>
        ))}
      </div>

      {/* Thông báo */}
      <p className={styles.colorNotice}>
        *Vui lòng liên hệ trực tiếp với chúng tôi qua thông tin liên hệ để nhận
        được catalog màu
      </p>
    </div>
  );
}
