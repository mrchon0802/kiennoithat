import React from "react";
import clsx from "clsx";
import "./houseDesign.css";
import Image from "next/image";

function HouseDesign({ productOption }) {
  const designItem = productOption?.kdsHouseDesign || [];
  return (
    <div className="kds-house-design">
      {designItem.map((item, index) => (
        <div
          key={item.id}
          className={clsx(
            "kds-hds",
            item.id === 1 ? "house-design" : "interior-desgin"
          )}
        >
          <div className="module-content">
            <div className="title">
              <h1>{item.title}</h1>
            </div>
            <div className="description">
              <p>{item.description}</p>
            </div>
            <button className="order-design-btn">{item.button}</button>
          </div>
          <div className="design-image">
            <Image src={item.src} alt="" width={180} height={180} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default HouseDesign;
