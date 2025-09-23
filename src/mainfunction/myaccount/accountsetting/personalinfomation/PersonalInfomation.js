"use client";

import clsx from "clsx";
import styles from "./PersonalInfomation.module.css";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function PersonalInfomation({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentId = useSelector((state) => state.login.currentId);
  const user = useSelector((state) => state.users.users);
  const currentUser = user.find((u) => u.id === currentId) || {};

  const {
    firstName = "",
    lastName = "",
    email = "",
    phoneNumber = "",
    backupPhoneNumber = "",
    address = "",
  } = currentUser;
  return (
    <div className={styles.personalInfomation}>
      <h1>Thông Tin Cá Nhân</h1>
      <p className={styles.subtitle}>
        Quản lý thông tin cơ bản, phương thức liên hệ và địa chỉ của bạn
      </p>
      <div className={styles.mainContentWrapper}>
        <div className={styles.basicInfo}>
          <section className={clsx(styles.infoBlock)}>
            <h2>Thông Tin Cơ Bản</h2>
            <div className={styles.infoRow}>
              <span className={styles.label}>Họ, tên</span>
              <span className={styles.value}>
                {firstName && lastName
                  ? `${firstName} ${lastName} `
                  : `Chưa có thông tin`}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Nước</span>
              <span className={styles.value}>Việt Nam</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Ngôn Ngữ</span>
              <span className={styles.value}>Tiếng Việt</span>
            </div>
          </section>
          <button
            className={clsx(styles.btn, styles.basicInfoEditBtn)}
            onClick={() =>
              router.push(
                "/account-settings/personal-infomation/edit-basic-infomation"
              )
            }
          >
            Thay đổi
          </button>
        </div>

        <section className={styles.infoBlock}>
          <h2>Thông Tin Liên Hệ</h2>
          <div className={clsx(styles.editInfoRow, styles.primaryEmail)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email </span>
              <span className={styles.value}>
                {email || "Chưa có thông tin"}
              </span>
            </div>
            <button
              className={clsx(styles.btn, styles.primaryEmailEditBtn)}
              onClick={() =>
                router.push(
                  "/account-settings/personal-infomation/change-primary-email"
                )
              }
            >
              Thay đổi
            </button>
          </div>
          <div className={clsx(styles.editInfoRow, styles.primaryPhoneNumber)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Số Điện Thoại</span>
              <span className={clsx(styles.value)}>
                {phoneNumber || "Chưa có thông tin"}
              </span>
            </div>
            <button
              className={clsx(styles.btn, styles.primaryPhoneNumberAddBtn)}
              onClick={() =>
                router.push(
                  "/account-settings/personal-infomation/add-phone-number"
                )
              }
            >
              Thay đổi
            </button>
          </div>
          <div className={clsx(styles.editInfoRow, styles.primaryPhoneNumber)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Số Điện Thoại Nhận Hàng</span>
              <span className={clsx(styles.value)}>
                {backupPhoneNumber || "Chưa có thông tin"}
              </span>
            </div>
            <button
              className={clsx(styles.btn, styles.primaryPhoneNumberAddBtn)}
              onClick={() =>
                router.push(
                  "/account-settings/personal-infomation/add-phone-number"
                )
              }
            >
              Thay đổi
            </button>
          </div>
        </section>

        <section className={styles.infoBlock}>
          <h2>Địa chỉ</h2>
          <div className={clsx(styles.editInfoRow, styles.mailing)}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Địa chỉ nhận hàng</span>
              <span className={clsx(styles.value)}>
                {address || "Chưa có thông tin"}
              </span>
            </div>
            <button
              className={clsx(styles.btn, styles.mailingAddBtn)}
              onClick={() =>
                router.push(
                  "/account-settings/personal-infomation/change-address"
                )
              }
            >
              Thay đổi
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
