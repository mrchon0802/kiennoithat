"use client";

import { useState } from "react";
import styles from "./security.module.css";
import clsx from "clsx";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Security() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("signin");
  const users = useSelector((state) => state.users.users);
  const currentId = useSelector((state) => state.login.currentId);
  const currentUser = users?.find((u) => u.id === currentId);
  const email = currentUser?.email;

  return (
    <div className={styles.security}>
      <h1>Bảo Mật</h1>
      <p className={styles.subtitle}>
        Quản lý các cài đặt liên quan đến việc đăng nhập và giữ an toàn cho tài
        khoản của bạn
      </p>
      <div className={styles.mainContentWrapper}>
        {/* Tabs */}
        <div className={styles.tabHeader}>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "signin" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("signin")}
          >
            Đăng Nhập
          </button>
          <button
            className={`${styles.tabBtn} ${
              activeTab === "thirdparty" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("thirdparty")}
          >
            Third Party Apps
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "signin" && (
          <div className={styles.signInContent}>
            {/* Sign In Management */}
            <section className={styles.infoBlock}>
              <h2>Quản Lí Đăng Nhập</h2>
              <p className={styles.infoDesc}>
                Quản lý các phương thức đăng nhập vào Tài khoản của bạn
              </p>
              <div className={styles.signInWrapper}>
                <div className={clsx(styles.editInfoRow, styles.signInEmail)}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Email Đăng Nhập</span>
                    <span className={styles.value}>
                      {email || "Chưa có thông tin"}
                    </span>
                  </div>
                  <button
                    className={clsx(styles.linkBtn, styles.signInEmailEditBtn)}
                    onClick={() =>
                      router.push(
                        "/account-settings/personal-infomation/change-primary-email"
                      )
                    }
                  >
                    Edit
                  </button>
                </div>
                <div
                  className={clsx(styles.editInfoRow, styles.signInPassword)}
                >
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Mật Khẩu</span>
                    <span className={styles.value}>--</span>
                  </div>
                  <button
                    className={clsx(styles.linkBtn, styles.resetPasswordBtn)}
                    onClick={() =>
                      router.push("/account-settings/security/change-password")
                    }
                  >
                    Đặt Lại
                  </button>
                </div>
                <div
                  className={clsx(styles.editInfoRow, styles.multiFactorAuth)}
                >
                  {" "}
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Xác Thực Đa Yếu Tố</span>
                    <span className={styles.value}>--</span>
                  </div>
                  <button
                    className={clsx(
                      styles.linkBtn,
                      styles.multiFactorAuthSetupBtn
                    )}
                  >
                    Cài Đặt
                  </button>
                </div>
                <div className={clsx(styles.editInfoRow, styles.recoveryEmail)}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Email Khôi Phục</span>
                    <span className={styles.value}>Chưa có thông tin</span>
                  </div>
                  <button
                    className={clsx(styles.linkBtn, styles.addRecoveryEmailBtn)}
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </section>

            {/* Sign In Activity */}
            <section className={styles.infoBlock}>
              <h2>Lịch Sử Đăng Nhập</h2>
              <p className={styles.infoDesc}>
                Các thiết bị bạn đã hoặc đang đăng nhập vào tài khoản của mình
                trong quá khứ. Để đăng xuất khỏi tất cả các phiên,{" "}
                <span> </span>
                <span
                  className={styles.resetPassword}
                  onClick={() =>
                    router.push("/account-settings/security/change-password")
                  }
                >
                  hãy đặt lại mật khẩu của bạn
                </span>
                .
              </p>

              <div className={styles.deviceBlock}>
                <div className={styles.deviceTitle}>💻 Windows 10</div>
                <ul className={styles.deviceList}>
                  <li className={styles.deviceAddress}>
                    <strong>Aug 26, 2025, 4:27 PM UTC</strong>
                    <p>Near Ho Chi Minh City, Vietnamon Chrome</p>
                  </li>
                  <li className={styles.deviceAddress}>
                    <strong>Aug 26, 2025, 5:42 AM UTC</strong>
                    <p>Near Ho Chi Minh City, Vietnam on Chrome</p>
                  </li>
                  <li className={styles.deviceAddress}>
                    <strong>Aug 25, 2025, 6:36 AM UTC</strong>
                    <p>Near Ho Chi Minh City, Vietnam on Chrome</p>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        )}

        {activeTab === "thirdparty" && (
          <div className={styles.thirdPartyContent}>
            <h2>Third Party Apps</h2>
            <p>No third party apps connected.</p>
          </div>
        )}
      </div>
    </div>
  );
}
