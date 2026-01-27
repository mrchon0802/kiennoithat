"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";

import styles from "./EditInfo.module.css";
import { loginSuccess } from "@/store/loginSlice";
import { userApi } from "@/api/userApi";

import type { RootState, AppDispatch } from "@/store/store";
import type { AuthUser } from "@/type/Login";

/* ===================== TYPES ===================== */

interface EditInfoForm {
  firstName: string;
  lastName: string;
  region: string;
  language: string;
}

/* ===================== COMPONENT ===================== */

const EditInfo: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector(
    (state: RootState) => state.login.user,
  ) as AuthUser | null;

  /* ===================== AUTH GUARD ===================== */
  useEffect(() => {
    if (!currentUser) {
      router.push("/auth");
    }
  }, [currentUser, router]);

  /* ===================== FORM STATE ===================== */
  const [formData, setFormData] = useState<EditInfoForm>({
    firstName: "",
    lastName: "",
    region: "Vietnam",
    language: "Tiếng Việt",
  });

  /* Sync redux → form */
  useEffect(() => {
    if (!currentUser) return;

    setFormData({
      firstName: currentUser.firstName ?? "",
      lastName: currentUser.lastName ?? "",
      region: "Vietnam",
      language: "Tiếng Việt",
    });
  }, [currentUser]);

  /* ===================== HANDLERS ===================== */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentUser) return;

    try {
      const res = await userApi.update(currentUser._id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      const authRaw = localStorage.getItem("auth");
      const token = authRaw ? (JSON.parse(authRaw)?.token ?? null) : null;

      dispatch(
        loginSuccess({
          user: res.data,
          token,
        }),
      );

      alert("Cập nhật thông tin thành công");
      router.push("/account-settings/personal-infomation");
    } catch (error) {
      console.error("Error updating user information:", error);
      alert("Cập nhật thất bại");
    }
  };

  const isActive =
    formData.firstName.trim() !== "" && formData.lastName.trim() !== "";

  /* ===================== RENDER ===================== */

  return (
    <div className={styles.editInfo}>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => router.push("/account-settings/personal-infomation")}
      >
        <ChevronLeft size={30} /> Quay lại
      </button>

      <h2>Thông Tin Cá Nhân</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ===================== NAME ===================== */}
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
            <label className={styles.label}>Tên</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
        </div>

        {/* ===================== REGION & LANGUAGE ===================== */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nước</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="Vietnam">Vietnam</option>
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
              <option value="Tiếng Việt">Tiếng Việt</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>

        {/* ===================== ACTIONS ===================== */}
        <div className={styles.formActions}>
          <button
            type="submit"
            className={clsx(styles.btnUpdate, isActive && styles.active)}
            disabled={!isActive}
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
};

export default EditInfo;
