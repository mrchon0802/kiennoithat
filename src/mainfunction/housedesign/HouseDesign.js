"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styles from "./houseDesign.module.css";
import Image from "next/image";

function HouseDesign() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/design-carousel");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Fetch data error:", err);
      }
    };
    fetchItems();
  }, []);
  return (
    <div className={styles.kdsHouseDesign}>
      {items.map((item, index) => (
        <div
          key={item._id}
          className={clsx(
            styles.kdsHds,
            item.title.includes("nhà")
              ? styles.houseDesign
              : styles.interiorDesign
          )}
        >
          <div className={styles.moduleContent}>
            <div className={styles.title}>
              <h1>{item.title}</h1>
            </div>
            <div className={styles.description}>
              <p>{item.description}</p>
            </div>
            <button
              className={styles.orderDesignBtn}
              style={{ cursor: "pointer" }}
            >
              {item.button}
            </button>
          </div>
          <div className={styles.designImage}>
            <Image src={item.image} alt="" width={180} height={180} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default HouseDesign;
