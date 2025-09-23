"use client";

import styles from "./ChangeEmail.module.css";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function ChangeEmail() {
  const users = useSelector((state) => state.users.users);
  const currentId = useSelector((state) => state.login.currentId);
  const currentUser = users?.find((u) => u.id === currentId);
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
