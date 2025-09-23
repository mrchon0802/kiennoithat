import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./MenuItemProduct.module.css";
import { useRouter } from "next/navigation";
import clsx from "clsx";

function MenuItemProduct({ item }) {
  const router = useRouter();
  const { button = [] } = item;
  return (
    <div className={styles.menuItem}>
      <div className={styles.itemImage}>
        <Link href={item.link}>
          <Image
            src={item.src}
            alt="menu-nav-product"
            width={170}
            height={70}
          />
        </Link>
      </div>
      <div className={styles.itemTitle}>
        <h4>{item.title}</h4>
      </div>
      <div className={styles.itemLink}>
        {button.map((btn, index) => (
          <Link
            key={btn.id}
            href={btn.link}
            className={clsx(styles.productItemBtn, styles[`btn${btn.id}`])}
          >
            {btn.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
export default MenuItemProduct;
