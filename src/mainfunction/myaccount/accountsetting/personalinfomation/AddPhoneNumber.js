"use client";

import { useEffect, useState } from "react";
import styles from "./AddPhoneNumber.module.css";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { userApi } from "@/api/userApi";
import { loginSuccess } from "@/store/loginSlice";

export default function AddPhoneNumber() {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.login.user);

  const [countryCode] = useState("+84");

  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  const [primaryPhone, setPrimaryPhone] = useState("");
  const [backupPhone, setBackupPhone] = useState("");

  useEffect(() => {
    if (currentUser?.phoneNumber?.startsWith(countryCode)) {
      setPrimaryPhone(currentUser.phoneNumber.replace(countryCode, ""));
    }
    if (currentUser?.backupPhoneNumber?.startsWith(countryCode)) {
      setBackupPhone(currentUser.backupPhoneNumber.replace(countryCode, ""));
    }
  }, [currentUser, countryCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updateData = {
        phoneNumber: primaryPhone ? `${countryCode}${primaryPhone}` : "",
        backupPhoneNumber: backupPhone ? `${countryCode}${backupPhone}` : "",
      };

      const res = await userApi.update(currentUser._id, updateData);

      const token =
        JSON.parse(localStorage.getItem("auth") || "{}").token || null;

      dispatch(loginSuccess({ user: res.data, token }));

      router.back();
    } catch (err) {
      console.error("Error when updating phone number", err);
    }
  };
  const isActive = primaryPhone.trim() !== "" && backupPhone.trim() !== "";
  return (
    <div className={styles.addPhone}>
      <div className={styles.title}>
        <button className={styles.backBtn} onClick={() => router.back()}>
          <i className="fa-solid fa-chevron-left"></i> Quay lại
        </button>
        <h2>Thêm Số Điện Thoại</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.phoneNumberEdit}>
          <div className={styles.formGroup}>
            <label>Số Điện Thoại</label>
            <div className={styles.phoneInput}>
              <select>
                <option>VN +84</option>
              </select>
              <input
                type="tel"
                placeholder=""
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Số Điện Thoại Nhận Hàng</label>
            <div className={styles.phoneInput}>
              <select>
                <option>VN +84</option>
              </select>
              <input
                type="tel"
                placeholder=""
                value={backupPhone}
                onChange={(e) => setBackupPhone(e.target.value)}
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
