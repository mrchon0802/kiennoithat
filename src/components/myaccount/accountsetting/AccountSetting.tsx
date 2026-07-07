"use client";

import React, { useEffect, useState, ReactNode } from "react";
import Link from "next/link";
import {
  User,
  Lock,
  Shield,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import styles from "./AccountSetting.module.css";
import Sidebar from "./SideBar";

/* ===================== TYPES ===================== */

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface AccountSettingProps {
  children: ReactNode;
}

/* ===================== COMPONENT ===================== */

const AccountSetting: React.FC<AccountSettingProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarItems: SidebarItem[] = [
    {
      id: "personal",
      label: "Thông Tin Cá Nhân",
      icon: <User size={18} />,
      path: "personal-infomation",
    },
    {
      id: "security",
      label: "Bảo Mật",
      icon: <Lock size={18} />,
      path: "security",
    },
    {
      id: "privacy",
      label: "Dữ Liệu Và Quyền Riêng Tư",
      icon: <Shield size={18} />,
      path: "privacy",
    },
    {
      id: "preferences",
      label: "Tùy Chọn",
      icon: <Settings size={18} />,
      path: "preferences",
    },
  ];

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className={styles.accountContainer}>
      {/* ===================== SIDEBAR ===================== */}
      <aside className={styles.sidebarControl}>
        <h3>Cài Đặt Tài Khoản</h3>

        {isMobile ? (
          <div className={styles.mobileMenu}>
            <button
              type="button"
              className={styles.mobileHeader}
              onClick={handleToggleMenu}
            >
              <div className={styles.mobileHeaderContent}>
                <div className={styles.mobileIcon}>
                  <User size={20} />
                </div>

                <span className={styles.mobileLabel}>Thông Tin Cá Nhân</span>

                {menuOpen ? (
                  <ChevronUp size={22} />
                ) : (
                  <ChevronDown size={22} />
                )}
              </div>
            </button>
          </div>
        ) : (
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <Link href={item.path} className={styles.sidebarItem}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* ===================== MOBILE SIDEBAR ===================== */}
      {menuOpen && <Sidebar onClose={handleCloseMenu} />}

      {/* ===================== MAIN CONTENT ===================== */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default AccountSetting;
