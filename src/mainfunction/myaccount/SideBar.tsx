import React, { ReactNode } from "react";
import Link from "next/link";
import styles from "./SideBar.module.css";
import { User, Home, CreditCard, Clock, LogOut, X } from "lucide-react";

/* ===================== TYPES ===================== */

interface SidebarProps {
  onClose: () => void;
  onLogout: () => void;
}

interface MenuItem {
  key: string;
  label: string;
  icon: ReactNode;
  path?: string;
  action?: () => void;
}

/* ===================== COMPONENT ===================== */

const Sidebar: React.FC<SidebarProps> = ({ onClose, onLogout }) => {
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
      action: onLogout,
    },
  ];

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.closeIcon}
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <X size={25} />
      </button>

      <aside className={styles.sidebarControl}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li key={item.key}>
              {item.path ? (
                <Link
                  href={item.path}
                  className={styles.sidebarItem}
                  onClick={onClose}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.action}
                  className={styles.sidebarItem}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
