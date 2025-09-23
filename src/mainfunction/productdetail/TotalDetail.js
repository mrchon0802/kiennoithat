"use client";

import React from "react";

function TotalDetail({ activeSelectedSize, productOption }) {
  const selectedWidth = productOption?.size?.[activeSelectedSize];
  return (
    <div>
      <div className="total-material">
        <span>
          <strong>Chất liệu:</strong>
          <ul>
            <li>MDF lõi xanh chống ẩm phủ Melamine.</li>
            <li>Sản phẩm được bảo hành 01 năm.</li>
          </ul>
        </span>
      </div>
    </div>
  );
}
export default TotalDetail;
