"use client";

import React, { ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

import styles from "./MyAccount.module.css";
import { logout } from "../../store/loginSlice";
import Sidebar from "./SideBar";

import {
  Home,
  User,
  CreditCard,
  ChevronDown,
  Clock,
  LogOut,
} from "lucide-react";

/* ===================== TYPES ===================== */

interface MyAccountProps {
  children: ReactNode;
}

interface MenuItem {
  key: string;
  label: string;
  icon: ReactNode;
  path?: string;
  action?: () => void;
}

/* ===================== COMPONENT ===================== */

const MyAccount: React.FC<MyAccountProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const [active, setActive] = useState<string>("products");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const isActive = (path?: string) =>
    path ? pathname.startsWith(path) : false;

  /* ===================== HANDLERS ===================== */

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===================== MENU ===================== */

  const menuItems: MenuItem[] = [
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

  /* ===================== RENDER ===================== */

  return (
    <div className={styles.accountContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebarControl}>
        {isMobile ? (
          <div className={styles.mobileMenu}>
            <button
              type="button"
              className={styles.mobileHeader}
              onClick={() => setMenuOpen((prev) => !prev)}
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
                  isActive(item.path) && styles.active,
                )}
                onClick={() => setActive(item.key)}
              >
                {item.path ? (
                  <Link href={item.path} className={styles.sidebarItem}>
                    <div className={styles.itemIcon}>{item.icon}</div>
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

      {menuOpen && (
        <Sidebar onClose={() => setMenuOpen(false)} onLogout={handleLogout} />
      )}

      {/* Content */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default MyAccount;
