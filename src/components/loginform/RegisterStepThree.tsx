"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from "@mui/material";
import clsx from "clsx";

import { userApi } from "@/api/userApi";
import { clearRegisterForm, createUser } from "../../store/userSlice";
import { loginStart, loginSuccess, loginFailure } from "../../store/loginSlice";

import styles from "./RegisterStepThree.module.css";
import type { RootState, AppDispatch } from "@/store/store";

// --------------------
// Component
// --------------------
const RegisterStepThree: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const registerForm = useSelector(
    (state: RootState) => state.users.registerForm,
  );

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!registerForm?.email || !registerForm?.password) {
      dispatch(loginFailure("Thiếu thông tin đăng ký"));
      return;
    }

    try {
      dispatch(loginStart());

      // 1. Tạo user
      const newUser = await dispatch(createUser(registerForm)).unwrap();
      console.log("✅ User created:", newUser);

      // 2. Auto login sau khi đăng ký
      const res = await userApi.login({
        email: registerForm.email,
        password: registerForm.password,
      });

      dispatch(loginSuccess(res.data));

      // 3. Clear register form
      dispatch(clearRegisterForm());

      router.push("/my-account");
    } catch (err: unknown) {
      console.error("❌ Lỗi khi đăng ký:", err);
      dispatch(loginFailure("Đăng ký thất bại"));
    }
  };

  return (
    <Box className={styles.formContainer}>
      <Box className={styles.formTitle}>
        <Typography className={styles.stepRegister}>Step 3 of 3</Typography>
        <Typography variant="h4">Xác Thực Email</Typography>
      </Box>

      <form className={styles.formActions} onSubmit={handleSubmit}>
        <FormHelperText className={styles.noticeStepThree}>
          Nhập code vừa được gửi đến email <strong>{registerForm.email}</strong>
        </FormHelperText>

        <TextField
          type="text"
          label="Enter verification code"
          fullWidth
          className={styles.verifyInput}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          className={clsx(styles.btn, styles.resendcodeBtn)}
        >
          Đăng Ký
        </Button>
      </form>
    </Box>
  );
};

export default RegisterStepThree;
