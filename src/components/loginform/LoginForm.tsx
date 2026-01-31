"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
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

import { userApi } from "@/api/userApi";
import { loginStart, loginFailure, loginSuccess } from "../../store/loginSlice";

import type { RootState, AppDispatch } from "@/store/store";

// --------------------
// Types
// --------------------
interface LoginFormValues {
  password?: string;
}

// --------------------
// Validation schema
// --------------------
const schema: yup.ObjectSchema<LoginFormValues> = yup.object({
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

// --------------------
// Component
// --------------------
const LoginForm: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const emailLogin = useSelector((state: RootState) => state.users.emailLogin);
  const error = useSelector((state: RootState) => state.login.error);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    if (!emailLogin) return;

    dispatch(loginStart());
    try {
      const res = await userApi.login({
        email: emailLogin,
        password: data.password,
      });
      dispatch(loginSuccess(res.data));
      router.push("/my-account");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Email hoặc mật khẩu không đúng";
      dispatch(loginFailure(msg));
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        p: 3,
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
                  onClick={() => setShowPassword((prev) => !prev)}
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
          fullWidth
          sx={{ mt: 2 }}
          disabled={!emailLogin}
        >
          Đăng Nhập
        </Button>
      </form>

      <Box mt={2} textAlign="center">
        <Button
          size="small"
          onClick={() => router.push("/auth/login/forgot-password")}
        >
          Forgot Password?
        </Button>
      </Box>

      <Divider sx={{ my: 2 }}>or</Divider>

      <Button
        variant="contained"
        fullWidth
        sx={{
          color: "var(--kds-color--color)",
          background: "#eee",
        }}
        onClick={() => router.push("/auth")}
      >
        Tạo Tài Khoản
      </Button>
    </Box>
  );
};

export default LoginForm;
