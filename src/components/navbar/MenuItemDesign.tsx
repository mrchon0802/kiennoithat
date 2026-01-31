"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./MenuItemDesign.module.css";

/* ================= TYPES ================= */

export interface MenuDesignItem {
  _id?: string;
  title: string;
  image: string;
  link?: string;
}

interface MenuItemDesignProps {
  item: MenuDesignItem;
}

/* ================= COMPONENT ================= */

const MenuItemDesign: React.FC<MenuItemDesignProps> = ({ item }) => {
  const { title, image, link = "/" } = item;

  return (
    <div className={styles.menuItem}>
      <div className={styles.itemImage}>
        <Image src={image} alt="menu-nav-design" width={170} height={70} />
      </div>

      <div className={styles.itemTitleDesign}>
        <h4>
          <Link href={link}>{title}</Link>
        </h4>
      </div>
    </div>
  );
};

export default MenuItemDesign;
