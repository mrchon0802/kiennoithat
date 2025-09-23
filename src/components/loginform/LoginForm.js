"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/navigation";
import { login } from "../../store/loginSlice";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Alert,
  Divider,
  Button,
} from "@mui/material";

//schema validate voi yup
const schema = yup.object().shape({
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 6 ký tự"),
});
export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.users);
  const emailLogin = useSelector((state) => state.users.emailLogin);

  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signInDate = useSelector((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    //tim user có email trung voi email vua nhap
    const currentUser = user.find(
      (u) => u.email.toLowerCase() === emailLogin.toLowerCase()
    );

    //check mat khau vua nhap co trung voi mat khau da luu khong
    if (currentUser && currentUser.password === passwordInput.trim()) {
      //neu dang nhap thanh cong thi luu lai id
      dispatch(login(currentUser.id));
      router.push("/my-account");
    } else {
      setError("Email hoặc mật khẩu này không đúng");
    }
  };
  const isActive = passwordInput.trim() !== "";
  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" mb={2}>
        Đăng Nhập
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="body1">{emailLogin}</Typography>
        <Button size="small" onClick={() => router.push("/auth")}>
          Thay đổi
        </Button>
      </Box>
      {error && (
        <Alert severity="error" icon={<CircleAlert size={20} />}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          fullWidth
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          margin="normal"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Đăng Nhập
        </Button>
      </form>
      <Box mt={2} textAlign="center">
        <Button
          onClick={() => router.push("/auth/login/forgot-password")}
          size="small"
        >
          Forgot Password?
        </Button>
      </Box>

      <Divider sx={{ my: 2 }}>or</Divider>

      <Button
        variant="contained"
        color="primary"
        sx={{ color: "var(--kds-color--color)", background: "#eee" }}
        fullWidth
        onClick={() => router.push("/auth")}
      >
        Tạo Tài Khoản
      </Button>
    </Box>
  );
}
