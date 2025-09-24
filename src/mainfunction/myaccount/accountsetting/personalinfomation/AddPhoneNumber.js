"use client";

import { useEffect, useState } from "react";
import styles from "./AddPhoneNumber.module.css";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../../store/userSlice";
import clsx from "clsx";

export default function AddPhoneNumber() {
  const router = useRouter();

  const dispatch = useDispatch();

  const users = useSelector((state) => state.users.users);
  const currentId = useSelector((state) => state.login.currentId);
  const currentUser = users?.find((u) => u.id === currentId);
  const phoneNumber = currentUser?.phoneNumber || "";
  const backupPhoneNumber = currentUser?.backupPhoneNumber || "";

  const [primaryPhone, setPrimaryPhone] = useState("");
  const [backupPhone, setBackupPhone] = useState("");
  const [countryCode] = useState("+84");

  useEffect(() => {
    if (phoneNumber.startsWith(countryCode)) {
      setPrimaryPhone(phoneNumber.replace(countryCode, ""));
    }
    if (backupPhoneNumber.startsWith(countryCode)) {
      setBackupPhone(backupPhoneNumber.replace(countryCode, ""));
    }
  }, [phoneNumber, backupPhoneNumber, countryCode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Phone Number:", countryCode, primaryPhone);

    const formatPrimaryPhone = `${countryCode}${primaryPhone}`;

    if (currentUser) {
      dispatch(
        updateUser({ id: currentUser.id, phoneNumber: formatPrimaryPhone })
      );
    }

    console.log("Phone Number:", countryCode, backupPhone);

    const formatBackupPhone = `${countryCode}${backupPhone}`;

    if (currentUser) {
      dispatch(
        updateUser({
          id: currentUser.id,
          backupPhoneNumber: formatBackupPhone,
        })
      );
    }
    router.back();
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
