"use client";

import React from "react";
import Link from "next/link";
import styles from "./SideBar.module.css";
import { User, Lock, Shield, Settings, X } from "lucide-react";

/* ===================== TYPES ===================== */

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SidebarProps {
  onClose: () => void;
}

/* ===================== COMPONENT ===================== */

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
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

  return (
    <div className={styles.container}>
      {/* Close button */}
      <button
        type="button"
        className={styles.closeIcon}
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <X size={25} />
      </button>

      <aside className={styles.sidebarControl}>
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
      </aside>
    </div>
  );
};

export default Sidebar;
