"use client";

import styles from "./ChangeEmail.module.css";
import { useSelector } from "react-redux";
import type { AuthUser } from "@/type/Login";
import type { RootState, AppDispatch } from "@/store/store";

export default function ChangeEmail() {
  const currentUser = useSelector(
    (state: RootState) => state.login.user,
  ) as AuthUser | null;
  const email = currentUser?.email || "";

  const handleResend = () => {
    console.log("Resend Email clicked");
  };

  return (
    <div className={styles.checkEmail}>
      <h2>Check Your Email</h2>
      <p>
        To continue changing your email, click on the link sent to{" "}
        <span className={styles.highlight}>{email}</span>
      </p>
      <p>If you cannot find the email, you can request a new one.</p>

      <button className={styles.btnResend} onClick={handleResend}>
        Resend Email
      </button>
    </div>
  );
}
