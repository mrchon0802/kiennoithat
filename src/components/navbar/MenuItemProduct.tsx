"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import styles from "./MenuItemProduct.module.css";

/* ================= TYPES ================= */

interface MenuButton {
  id: number | string;
  label: string;
  link: string;
}

export interface MenuProductItem {
  _id?: string;
  title: string;
  link: string;
  image: string;
  button?: MenuButton[];
}

interface MenuItemProductProps {
  item: MenuProductItem;
}

/* ================= COMPONENT ================= */

const MenuItemProduct: React.FC<MenuItemProductProps> = ({ item }) => {
  const { title, link, image, button = [] } = item;

  return (
    <div className={styles.menuItem}>
      <div className={styles.itemImage}>
        <Link href={link}>
          <Image src={image} alt="menu-nav-product" width={170} height={70} />
        </Link>
      </div>

      <div className={styles.itemTitle}>
        <h4>{title}</h4>
      </div>

      <div className={styles.itemLink}>
        {button.map((btn, index) => (
          <Link
            key={`${item._id ?? title}-${btn.id}-${index}`}
            href={btn.link}
            className={clsx(styles.productItemBtn, styles[`btn${btn.id}`])}
          >
            {btn.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuItemProduct;
