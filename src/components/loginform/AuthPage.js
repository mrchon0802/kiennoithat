"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setEmailLogin } from "../../store/userSlice";
import styles from "./AuthPage.module.css";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Button,
  TextField,
  AddBox,
  Divider,
  Link,
} from "@mui/material";
import { Mode } from "@mui/icons-material";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email hợp lệ"),
});

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const onSubmit = (data) => {
    dispatch(setEmailLogin(data.email));
    router.push("/auth/login");
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "0 auto",
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h4" component="h2" textAlign="left" mb={3}>
        Đăng Nhập
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          fullWidth
          variant="outlined"
          margin="normal"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={!isValid}
        >
          Tiếp Theo
        </Button>
      </form>

      <Box textAlign="center" mt={2}>
        <Link href="#" underline="hover" variant="body2">
          Quên email hoặc mật khẩu?
        </Link>
      </Box>

      <Divider sx={{ my: 3 }}>or</Divider>

      <Button
        variant="contained"
        color="primary"
        sx={{ color: "var(--kds-color--color)", background: "#eee" }}
        fullWidth
        onClick={() => router.push("/auth/register/step-1")}
      >
        Tạo Tài Khoản
      </Button>
    </Box>
  );
}
