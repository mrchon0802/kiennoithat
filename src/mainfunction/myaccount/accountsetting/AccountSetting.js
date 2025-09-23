import { User, Lock, Shield, Settings } from "lucide-react";
import Link from "next/link";
import styles from "./AccountSetting.module.css";
import clsx from "clsx";

export default function AccountSetting({ children }) {
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
    <div className={styles.accountContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebarControl}>
        <h3>Cài Đặt Tài Khoản</h3>
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

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children} {/* Đây là chỗ để render nội dung của route con */}
      </main>

      {/* Right Panel */}
      <aside className={styles.rightPanel}>
        <h3>Kiểm Tra Bảo Mật</h3>
        <p>
          Hoàn thành các bước sau để bảo vệ và có thể khôi phục tài khoản của
          bạn
        </p>

        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: "33%" }}></div>
        </div>
        <p className={styles.progressText}>1 of 3 đã hoàn thành</p>

        <div className={styles.checkupItem}>
          <input type="radio" name="mfa" />
          <div>
            <strong>Cài đặt Xác thực đa yếu tố </strong>
            <p className={styles.checkupItemText}>
              Bảo vệ tài khoản của bạn bằng cách yêu cầu một hình thức xác minh
              thứ hai trước khi đăng nhập
            </p>
            <button className={styles.btn}>Cài Đặt</button>
          </div>
        </div>

        <div className={styles.checkupItem}>
          <input type="radio" name="mfa" />
          <div>
            <strong className={styles.checkupItemStrong}>
              Thêm Email khôi phục
            </strong>
          </div>
        </div>

        <div className={clsx(styles.checkupItem, styles.verified)}>
          <span className={styles.checkupItemSpan}>✔</span>
          <div>
            <strong className={styles.checkupItemStrong}>
              Email đã xác minh
            </strong>
          </div>
        </div>
      </aside>
    </div>
  );
}
