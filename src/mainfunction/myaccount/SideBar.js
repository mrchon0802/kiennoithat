import styles from "./SideBar.module.css";
import { User, Home, CreditCard, Clock, LogOut, X } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ onClose, onLogout }) {
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
      action: onLogout,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.closeIcon}>
        <X size={25} onClick={onClose} />{" "}
      </div>
      <aside className={styles.sidebarControl}>
        <ul style={{ gap: "20px", fontSize: "20px" }}>
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.path ? (
                // 👉 Nếu có path → dùng Link
                <Link href={item.path} className={styles.sidebarItem}>
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                // 👉 Nếu có action → dùng button
                <button
                  type="button"
                  onClick={item.action}
                  className={styles.sidebarItem}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontWeight: "550",
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
