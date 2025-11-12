import styles from "./SideBar.module.css";
import { User, Lock, Shield, Settings, X } from "lucide-react";
import Link from "next/link";

export default function Sidebar({ onClose }) {
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

  return (
    <div className={styles.container}>
      <div className={styles.closeIcon}>
        <X size={25} onClick={onClose} />{" "}
      </div>
      <aside className={styles.sidebarControl}>
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
      </aside>
    </div>
  );
}
