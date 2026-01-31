"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Phone, User, ShoppingCart, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import type { RootState } from "@/store/store";
import type { NavBarProps } from "@/type/Navbar";

import styles from "./NavBar.module.css";
import MenuItemDesign from "./MenuItemDesign";
import MenuItemProduct from "./MenuItemProduct";
import SearchBox from "../SearchBox/SearchBox";

/* ================= TYPES ================= */

type OpenMenu = "noithat" | "thietke" | null;

/* ================= COMPONENT ================= */

const NavBar: React.FC<NavBarProps> = ({ productItems, designItems }) => {
  const pathname = usePathname();
  const currentUser = useSelector((state: RootState) => state.login.user);

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);

  const showMainMenus = pathname === "/";
  const showCart = !pathname.startsWith("/auth");
  const logo = "/logo/logo.png";
  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.leftGroup}>
        <Link href="/">
          <div className={styles.webNameLogo}>
            {logo && <Image src={logo} alt="logo" width={60} height={60} />}
          </div>
        </Link>
        <SearchBox />
      </div>

      {/* Main menus */}
      {showMainMenus && (
        <div className={styles.navItemGroup}>
          {/* Nội thất */}
          <div
            className={styles.navItemWrapper}
            onMouseEnter={() => setOpenMenu("noithat")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link href="/" className={styles.navItem}>
              Nội Thất
            </Link>

            <div
              className={clsx(
                styles.megaMenu,
                openMenu === "noithat" && styles.open,
              )}
            >
              <div className={styles.menuGrid}>
                {productItems.map((item) => (
                  <MenuItemProduct key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>

          {/* Thiết kế */}
          <div
            className={styles.navItemWrapper}
            onMouseEnter={() => setOpenMenu("thietke")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link href="/" className={styles.navItem}>
              Thiết Kế
            </Link>

            <div
              className={clsx(
                styles.megaMenu,
                openMenu === "thietke" && styles.open,
              )}
            >
              <div className={styles.menuGrid}>
                {designItems.map((item) => (
                  <MenuItemDesign key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={styles.navItemFunction}>
        {/* <Link href="/">
          <Search size={20} />
        </Link> */}

        {showCart && (
          <Link href="/cart">
            <ShoppingCart size={20} />
          </Link>
        )}

        <Link href="/contact">
          <Phone size={20} />
        </Link>

        {currentUser ? (
          <Link href="/my-account" className={styles.navUser}>
            <User size={20} />
            <span>
              {currentUser.firstName} {currentUser.lastName}
            </span>
          </Link>
        ) : (
          <Link href="/auth">
            <User size={20} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
