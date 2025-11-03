"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../../../store/loginSlice";
import styles from "./EditInfo.module.css";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import { userApi } from "@/api/userApi";

export default function EditInfo() {
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.login.user);

  //neu chua login thi login
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  //set form dât bang du lieu redux
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
  });

  //khi component mount, dong bo du lieu redux -> form data
  useEffect(() => {
    setFormData({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
    });
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //luu thong tin da su vao redux store

    if (!currentUser) {
      console.error("Không tìm thấy user đang đăng nhập");
      return;
    }

    try {
      const updateUser = await userApi.update(currentUser._id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      dispatch(
        loginSuccess({
          user: updateUser.data,
          token: localStorage.getItem("auth")
            ? JSON.parse(localStorage.getItem("auth")).token
            : null,
        })
      );

      alert("update information succedd");
      router.push("/account-settings/personal-infomation");
    } catch (err) {
      console.error("Error updating user information:", err);
    }

    console.log("update info", formData);
    router.push("/account-settings/personal-infomation");
  };
  const isActive =
    formData.firstName.trim() !== "" && formData.lastName.trim() !== "";
  return (
    <div className={styles.editInfo}>
      <button
        className={styles.backBtn}
        onClick={() => router.push("/account-settings/personal-infomation")}
      >
        <ChevronLeft size={30} /> Quay lại
      </button>
      <h2>Thông tin cá nhân</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Họ</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tến</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nước</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={styles.select}
            >
              <option>Vietnam</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ngôn Ngữ</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className={styles.select}
            >
              <option>Tiếng Việt</option>
              <option>English</option>
            </select>
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
