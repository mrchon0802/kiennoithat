"use client";

import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import styles from "./ChangePassword.module.css";
import clsx from "clsx";
import { updateUser } from "../../../../store/userSlice";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function ChangePassword() {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUser = useSelector((state) => state.login.user);
  const currentId = currentUser?._id;
  const currentPassword = currentUser?.password;

  const [currentPasswordInput, setCurrentPasswordInput] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({
    currentPassword: "",
    password: [],
    confirmPassword: "",
  });

  const validatePassword = (value) => {
    const rule = [];
    if (value.length < 8) rule.push("Tối thiểu 8 kí tự");
    if (!/[a-zA-Z]/.test(value))
      rule.push("Tối thiểu một chữ cái [a-z hoặc A-Z]");
    if (!/[0-9]/.test(value)) rule.push("Tối thiểu một chữ số [0-9]");
    if (!/[^a-zA-Z0-9]/.test(value)) rule.push("Tối thiểu một ký tự đặc biệt");
    return rule;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //check pass hien tai
    if (currentPasswordInput !== currentPassword) {
      setError((prev) => ({ ...prev, currentPassword: "Mật khẩu không đúng" }));
      return;
    }

    const passwordError = validatePassword(form.password);
    const confirmPasswordError =
      passwordError.length === 0 && form.confirmPassword !== form.password
        ? "Mật khẩu không khớp"
        : "";
    const newError = {
      password: passwordError,
      confirmPassword: confirmPasswordError,
      currentPasswordError: "",
    };
    setError(newError);
    const noError = newError.password.length === 0 && !newError.confirmPassword;
    if (noError) {
      try {
        await dispatch(updateUser({ id: currentId, password: form.password }));
        router.push("/account-settings/security");
      } catch (err) {
        console.error("Update failed", err);
      }
    }
  };

  const isActive =
    currentPassword !== "" &&
    form.password !== "" &&
    form.confirmPassword !== "";

  return (
    <div className={styles.changePassword}>
      <div className={styles.title}>
        <Link
          className={styles.backBtn}
          href={"/account-settings/securiy"}
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <ChevronLeft size={30} /> Quay lại
        </Link>
        <h2>Đổi Mật Khẩu</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Mật khẩu hiện tại</label>
            <div className={styles.inputBox}>
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={currentPasswordInput || ""} // Gán giá trị từ state
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
              />
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Mật khẩu mới</label>
            <div className={styles.inputBox}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
              />

              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {error.password.length > 0 && (
              <div className={styles.errorList}>
                <p>Yêu cầu về mật khẩu:</p>
                <ul>
                  {error.password.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label>Xác nhận lại mật khẩu</label>
            <div className={styles.inputBox}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              <button
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {error.confirmPassword && (
              <p className="error">{error.confirmPassword}</p>
            )}
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
