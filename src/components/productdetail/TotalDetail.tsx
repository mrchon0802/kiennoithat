"use client";

import React from "react";
import styles from "./styles/TotalDetail.module.css";

function TotalDetail() {
  return (
    <div>
      <div className={styles.totalMaterial}>
        <h4 className={styles.totalTitle}>Chất liệu:</h4>
        <ul className={styles.detail}>
          <li>Gỗ tự nhiên chống ẩm phủ Melamine.</li>
          <li>Sản phẩm được bảo hành 01 năm.</li>
        </ul>
      </div>
    </div>
  );
}
export default TotalDetail;
