"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./NavBar.module.css";
import MenuItemProduct from "./MenuItemProduct";
import MenuItemDesign from "./MenuItemDesign";
import { Phone, User, Globe, ShoppingCart, Search } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

function NavBar({ productOption }) {
  const [openMenu, setOpenMenu] = useState(null);

  const logo = productOption?.logo;
  const menuItems = productOption?.navItemGroup?.productNavItem || [];
  const menuItemDesign = productOption?.navItemGroup?.designNavItem || [];
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.webName}>
        <div className={styles.webNameLogo}>
          {logo && <Image src={logo} alt="logo" width={200} height={60} />}
        </div>
      </Link>
      <div className={styles.navItemGroup}>
        <div className={styles.navItemWrapper}>
          <div
            className={styles.navItem}
            onMouseEnter={() => setOpenMenu("noithat")}
          >
            <Link href="/">Nội Thất</Link>
          </div>
          <div
            className={clsx(
              styles.megaMenu,
              openMenu === "noithat" && styles.open
            )}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className={styles.menuGrid}>
              {menuItems.map((item, index) => (
                <MenuItemProduct key={uuidv4()} item={item} />
              ))}
            </div>
          </div>
        </div>
        <div
          className={styles.navItemWrapper}
          onMouseEnter={() => setOpenMenu("thietke")}
        >
          <div className={styles.navItem}>
            <Link href="/">Thiết Kế</Link>
          </div>
          <div
            className={clsx(
              styles.megaMenu,
              openMenu === "thietke" && styles.open
            )}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <div className={styles.menuGrid}>
              {menuItemDesign.map((item, index) => (
                <MenuItemDesign key={uuidv4()} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.navItemFunction}>
        <Link href="/">
          <Search size={20} />
        </Link>
        <Link href="/shopping-cart">
          <ShoppingCart size={20} />
        </Link>
        <Link href="/">
          <Phone size={20} />
        </Link>
        <Link href="/" className={styles.navLang}>
          <Globe size={20} />
        </Link>
        <Link href="/auth" className={styles.navLogin}>
          <User size={20} />
        </Link>
      </div>
    </nav>
  );
}
export default NavBar;
