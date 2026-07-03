// components/NavBar/Navbar.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, User, ShoppingCart, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import styles from "./NavBar.module.css";
import SearchBox from "../SearchBox/SearchBox";
import NavMenuItem from "./NavMenuItem";
import MobileMenu from "./MobileMenu";
import { PRODUCT_CATEGORIES } from "./categories";

const MOBILE_BREAKPOINT = 1200;

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const currentUser = useSelector((state: RootState) => state.login.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showCart = !pathname.startsWith("/auth");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className={styles.navbar}>
      {/* Logo — luôn hiển thị */}
      <div className={styles.leftGroup}>
        <Link href="/">
          <div className={styles.webNameLogo}>
            <Image src="/logo/logo.png" alt="logo" width={60} height={60} />
          </div>
        </Link>
        {/* Ẩn SearchBox trên mobile bằng CSS (xem bên dưới) */}
        <div className={styles.searchWrap}>
          <SearchBox />
        </div>
      </div>

      {/* Menu desktop — ẩn trên mobile */}
      <div className={styles.navItemGroup}>
        {PRODUCT_CATEGORIES.map((cat) => (
          <NavMenuItem
            key={cat.slug}
            label={cat.label}
            slug={cat.slug}
            room={cat.room}
          />
        ))}
      </div>

      {/* Actions desktop — ẩn trên mobile */}
      <div className={styles.navItemFunction}>
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

      {/* Nút Menu — chỉ hiện trên mobile */}
      <button
        className={styles.mobileMenuBtn}
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Mở menu"
      >
        <Menu size={24} />
      </button>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </nav>
  );
};

export default NavBar;
