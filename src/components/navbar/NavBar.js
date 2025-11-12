"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import styles from "./NavBar.module.css";
import { Phone, User, Globe, ShoppingCart, Search } from "lucide-react";
import Image from "next/image";
import MenuItemDesign from "./MenuItemDesign";
import MenuItemProduct from "./MenuItemProduct";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

export default function NavBar() {
  const logo = "/logo/logo1.png";

  const pathname = usePathname();

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.login.user);

  const [openMenu, setOpenMenu] = useState(null);

  const [productItems, setProductItems] = useState([]);
  const [designItems, setDesignItems] = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    async function fetchData() {
      try {
        const [productRes, designRes] = await Promise.all([
          fetch(`${apiUrl}/product-nav-items`).then((r) => r.json()),
          fetch(`${apiUrl}/design-nav-items`).then((r) => r.json()),
        ]);
        setProductItems(productRes);
        setDesignItems(designRes);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, [apiUrl]);

  const showMainMenus = pathname === "/";

  const hideCart = pathname.startsWith("/auth");
  const showCart = !hideCart;
  return (
    <div className={styles.navbar}>
      <Link href="/" className={styles.webName}>
        <div className={styles.webNameLogo}>
          {logo && <Image src={logo} alt="logo" width={200} height={60} />}
        </div>
      </Link>
      {showMainMenus && (
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
                {(productItems || []).map((item, index) => (
                  <MenuItemProduct key={item._id} item={item} />
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
                {(designItems || []).map((item, index) => (
                  <MenuItemDesign key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.navItemFunction}>
        <Link href="/">
          <Search size={20} />
        </Link>
        {showCart && (
          <Link href="/cart">
            <ShoppingCart size={20} />
          </Link>
        )}
        <Link href="/">
          <Phone size={20} />
        </Link>

        {currentUser ? (
          <Link href="/my-account" className={styles.navUser}>
            <User size={20} />
            <span className={styles.username}>
              {`${currentUser.firstName} ${currentUser.lastName}`}
            </span>
          </Link>
        ) : (
          <Link href="/auth" className={styles.navLogin}>
            <User size={20} />
          </Link>
        )}
      </div>
    </div>
  );
}
