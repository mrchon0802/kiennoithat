"use client";

import React, { Children, useEffect } from "react";
import { useState } from "react";
import styles from "./MyAccount.module.css";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { logout } from "../../store/loginSlice";
import {
  Home,
  User,
  CreditCard,
  ChevronDown,
  Clock,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "./SideBar";

export default function MyAccount({ children }) {
  const dispatch = useDispatch();
  const [active, setActive] = useState("products");
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path) => pathname.startsWith(`${path}`);

  const handleLogout = () => {
    //goi logout
    dispatch(logout());

    router.push("/");
  };

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      key: "products",
      label: "Sản Phẩm Của Tôi",
      icon: <Home size={20} />,
      path: "/my-account/my-product",
    },
    {
      key: "settings",
      label: "Cài Đặt Tài Khoản",
      icon: <User size={20} />,
      path: "/account-settings",
    },
    {
      key: "payment",
      label: "Phương Thức Thanh Toán",
      icon: <CreditCard size={20} />,
      path: "/payment-method",
    },
    {
      key: "history",
      label: "Lịch Sử Đặt Hàng",
      icon: <Clock size={20} />,
      path: "/my-account/order-history",
    },
    {
      key: "signout",
      label: "Đăng Xuất",
      icon: <LogOut size={20} />,
      action: handleLogout,
    },
  ];
  const handClick = () => {
    setMenuOpen(true);
  };
  const handClose = () => {
    setMenuOpen(false);
  };
  return (
    <div className={styles.accountContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebarControl}>
        {isMobile ? (
          <div className={styles.mobileMenu}>
            <button
              className={styles.mobileHeader}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className={styles.mobileHeaderContent}>
                <div className={styles.mobileIcon}>
                  <User size={20} />
                </div>
                <span className={styles.mobileLabel}>Sản Phẩm Của Tôi</span>
                <ChevronDown size={25} className={styles.mobileArrowDown} />
              </div>
            </button>
          </div>
        ) : (
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.key}
                className={clsx(
                  styles.sidebarControlItem,
                  isActive(item.path) && styles.active
                )}
                onClick={() => setActive(item.key)}
              >
                {item.path ? (
                  <Link href={item.path} className={styles.sidebarItem}>
                    <div className={styles.itemIcon}> {item.icon}</div>
                    <div className={styles.itemLabel}>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={item.action}
                    className={styles.sidebarItem}
                  >
                    <div className={styles.itemIcon}>{item.icon}</div>
                    <div className={styles.itemLabel}>
                      <span>{item.label}</span>
                    </div>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </aside>
      {menuOpen && <Sidebar onClose={handClose} onLogout={handleLogout} />}

      <main className={styles.mainContent}>{children}</main>
      {/* Content */}
    </div>
  );
}
