"use client";

import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import styles from "./AddPhoneNumber.module.css";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { userApi } from "@/api/userApi";
import { loginSuccess } from "@/store/loginSlice";
import type { RootState } from "@/store/store";

export default function AddPhoneNumber() {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.login.user);
  const token = useSelector((state: RootState) => state.login.token);

  /* =======================
     Constants
  ======================= */
  const countryCode = "+84";

  /* =======================
     Redirect nếu chưa login
  ======================= */
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  /* =======================
     Form state
  ======================= */
  const [primaryPhone, setPrimaryPhone] = useState<string>("");
  const [backupPhone, setBackupPhone] = useState<string>("");

  /* =======================
     Init form từ redux
  ======================= */
  useEffect(() => {
    if (currentUser?.phoneNumber?.startsWith(countryCode)) {
      setPrimaryPhone(currentUser.phoneNumber.replace(countryCode, ""));
    }

    if (currentUser?.backupPhoneNumber?.startsWith(countryCode)) {
      setBackupPhone(currentUser.backupPhoneNumber.replace(countryCode, ""));
    }
  }, [currentUser]);

  /* =======================
     Submit
  ======================= */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser?._id) return;

    try {
      const updateData = {
        phoneNumber: primaryPhone ? `${countryCode}${primaryPhone}` : "",
        backupPhoneNumber: backupPhone ? `${countryCode}${backupPhone}` : "",
      };

      const res = await userApi.update(currentUser._id, updateData);

      dispatch(loginSuccess({ user: res.data, token }));
      router.back();
    } catch (err) {
      console.error("Error when updating phone number", err);
    }
  };

  const isActive = primaryPhone.trim() !== "" && backupPhone.trim() !== "";

  /* =======================
     Render
  ======================= */
  return (
    <div className={styles.addPhone}>
      <div className={styles.title}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <i className="fa-solid fa-chevron-left" /> Quay lại
        </button>
        <h2>Thêm Số Điện Thoại</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.phoneNumberEdit}>
          {/* Primary phone */}
          <div className={styles.formGroup}>
            <label>Số Điện Thoại</label>
            <div className={styles.phoneInput}>
              <select disabled>
                <option>VN +84</option>
              </select>
              <input
                type="tel"
                value={primaryPhone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPrimaryPhone(e.target.value)
                }
              />
            </div>
          </div>

          {/* Backup phone */}
          <div className={styles.formGroup}>
            <label>Số Điện Thoại Nhận Hàng</label>
            <div className={styles.phoneInput}>
              <select disabled>
                <option>VN +84</option>
              </select>
              <input
                type="tel"
                value={backupPhone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setBackupPhone(e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={clsx(styles.btnUpdate, isActive && styles.active)}
          >
            Cập nhật
          </button>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={() => router.back()}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
