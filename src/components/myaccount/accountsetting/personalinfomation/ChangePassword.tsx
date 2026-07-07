"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

import styles from "./ChangePassword.module.css";
import { updateUser } from "@/store/userSlice";
import type { AuthUser } from "@/type/Login";
import type { RootState, AppDispatch } from "@/store/store";

/* ===================== TYPES ===================== */

interface PasswordForm {
  password: string;
  confirmPassword: string;
}

interface PasswordError {
  currentPassword: string;
  password: string[];
  confirmPassword: string;
}

/* ===================== COMPONENT ===================== */

const ChangePassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const currentUser = useSelector(
    (state: RootState) => state.login.user,
  ) as AuthUser | null;

  const currentId = currentUser?._id;
  const currentPassword = currentUser?.password;

  /* ===================== STATE ===================== */

  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [form, setForm] = useState<PasswordForm>({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<PasswordError>({
    currentPassword: "",
    password: [],
    confirmPassword: "",
  });

  /* ===================== HELPERS ===================== */

  const validatePassword = (value: string): string[] => {
    const rules: string[] = [];

    if (value.length < 8) rules.push("Tối thiểu 8 ký tự");
    if (!/[a-zA-Z]/.test(value))
      rules.push("Tối thiểu một chữ cái (a–z hoặc A–Z)");
    if (!/[0-9]/.test(value)) rules.push("Tối thiểu một chữ số (0–9)");
    if (!/[^a-zA-Z0-9]/.test(value)) rules.push("Tối thiểu một ký tự đặc biệt");

    return rules;
  };

  /* ===================== HANDLERS ===================== */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* Check current password */
    if (currentPasswordInput !== currentPassword) {
      setError((prev) => ({
        ...prev,
        currentPassword: "Mật khẩu hiện tại không đúng",
      }));
      return;
    }

    const passwordError = validatePassword(form.password);
    const confirmPasswordError =
      passwordError.length === 0 && form.confirmPassword !== form.password
        ? "Mật khẩu không khớp"
        : "";

    const newError: PasswordError = {
      currentPassword: "",
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };

    setError(newError);

    const noError = newError.password.length === 0 && !newError.confirmPassword;

    if (!noError || !currentId) return;

    try {
      await dispatch(
        updateUser({
          id: currentId!,
          data: {
            password: form.password,
          },
        }),
      ).unwrap();

      router.push("/account-settings/security");
    } catch (err) {
      console.error("Update password failed", err);
    }
  };

  const isActive =
    currentPasswordInput.trim() !== "" &&
    form.password.trim() !== "" &&
    form.confirmPassword.trim() !== "";

  /* ===================== RENDER ===================== */

  return (
    <div className={styles.changePassword}>
      <div className={styles.title}>
        <Link className={styles.backBtn} href="/account-settings/security">
          <ChevronLeft size={30} /> Quay lại
        </Link>
        <h2>Đổi Mật Khẩu</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ===================== CURRENT PASSWORD ===================== */}
        <div className={styles.formGroup}>
          <label>Mật khẩu hiện tại</label>
          <div className={styles.inputBox}>
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPasswordInput}
              onChange={(e) => setCurrentPasswordInput(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((v) => !v)}
            >
              {showCurrentPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {error.currentPassword && (
            <p className={styles.errorText}>{error.currentPassword}</p>
          )}
        </div>

        {/* ===================== NEW PASSWORD ===================== */}
        <div className={styles.formGroup}>
          <label>Mật khẩu mới</label>
          <div className={styles.inputBox}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <button type="button" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {error.password.length > 0 && (
            <div className={styles.errorList}>
              <p>Yêu cầu về mật khẩu:</p>
              <ul>
                {error.password.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ===================== CONFIRM PASSWORD ===================== */}
        <div className={styles.formGroup}>
          <label>Xác nhận mật khẩu</label>
          <div className={styles.inputBox}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>

          {error.confirmPassword && (
            <p className={styles.errorText}>{error.confirmPassword}</p>
          )}
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

export default ChangePassword;
