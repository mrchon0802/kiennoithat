"use client";

import { User, Lock, Shield, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./AccountSetting.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import Sidebar from "./SideBar";

export default function AccountSetting({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarItems = [
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
        <h3>Cài Đặt Tài Khoản</h3>

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
                <span className={styles.mobileLabel}>Thông Tin Cá Nhân</span>
                <ChevronDown size={25} className={styles.mobileArrowDown} />
              </div>
              {/* {menuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />} */}
            </button>
          </div>
        ) : (
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <Link href={item.path} className={styles.sidebarItem}>
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
      {menuOpen && <Sidebar onClose={handClose} />}
      {/* Main Content */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
