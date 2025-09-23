"use client";

import React from "react";
import { useSelector } from "react-redux";
import styles from "./ForgotPassword.module.css";
import clsx from "clsx";

function ForgotPassword() {
  const currentEmail = useSelector((state) => state.users.emailLogin);

  return (
    <div className={clsx(styles.formContainer, styles.forgotPassword)}>
      <div className={styles.formTitle}>
        <h2>Xác Minh Danh Tính</h2>
      </div>
      <p>
        Để xác nhận danh tính của bạn trước khi đặt lại mật khẩu, một mã xác
        minh sẽ được gửi đến{" "}
        <span className={styles.forgotPasswordEmail}>{currentEmail}</span> nếu
        tài khoản này tồn tại.
      </p>
      <button className={clsx(styles.sendCode, styles.btn)}>Send Code</button>
    </div>
  );
}
export default ForgotPassword;
