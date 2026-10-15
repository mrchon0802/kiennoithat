"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import styles from "./houseDesign.module.css";

/* ===================== TYPES ===================== */

interface HouseDesignItem {
  _id: string;
  title: string;
  description: string;
  button: string;
  image: string;
}

/* ===================== COMPONENT ===================== */

const HouseDesign: React.FC = () => {
  const [items, setItems] = useState<HouseDesignItem[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${apiUrl}/design-carousel`);
        const data: HouseDesignItem[] = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Fetch data error:", err);
      }
    };

    fetchItems();
  }, [apiUrl]);

  return (
    <div className={styles.kdsHouseDesign}>
      {items.map((item) => (
        <div
          key={item._id}
          className={clsx(
            styles.kdsHds,
            item.title.includes("nhà")
              ? styles.houseDesign
              : styles.interiorDesign,
          )}
        >
          <div className={styles.moduleContent}>
            <div className={styles.title}>
              <h1>{item.title}</h1>
            </div>

            <div className={styles.description}>
              <p>{item.description}</p>
            </div>

            <button className={styles.orderDesignBtn} type="button">
              {item.button}
            </button>
          </div>

          <div className={styles.designImage}>
            <Image src={item.image} alt={item.title} width={180} height={180} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default HouseDesign;
