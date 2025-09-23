import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./MenuItemDesign.module.css";

function MenuItemDesign({ item }) {
  return (
    <div className={styles.menuItem}>
      <div className={styles.itemImage}>
        <Image src={item.src} alt="menu-nav-design" width={170} height={70} />
      </div>
      <div className={styles.itemTitleDesign}>
        <h4>
          <Link href="/">{item.title}</Link>
        </h4>
      </div>
    </div>
  );
}
export default MenuItemDesign;
