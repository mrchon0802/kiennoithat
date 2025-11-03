"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { updateRegisterForm } from "../../store/userSlice";
import { useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import styles from "./RegisterStepTwo.module.css";
import { userApi } from "@/api/userApi";
import {
  Box,
  TextField,
  Typography,
  FormHelperText,
  IconButton,
  InputAdornment,
  Button,
} from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const schema = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email hợp lệ"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
    .matches(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .matches(/[0-9]/, "Mật khẩu phải có ít nhất 1 số")
    .matches(/[@$!%*?&]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
  confirmPassword: yup
    .string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
});

function RegisterStepTwo() {
  const dispatch = useDispatch();
  const router = useRouter();

  const registerForm = useSelector((state) => state.users.registerForm);

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: registerForm.email,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
    },
  });
  //valiedate email
  const onSubmit = async (data) => {
    console.log("Step 2 submit data:", data);
    try {
      const user = await userApi.getByEmail(data.email);

      if (user) {
        setError("email", {
          type: "manual",
          message: `Email ${data.email} đã tồn tại`,
        });
        return;
      }
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        console.error("Lỗi khi kiểm tra email:", err);
        setError("email", {
          type: "manual",
          message: "Không thể kiểm tra email. Vui lòng thử lại sau.",
        });
        return;
      }
    }

    const { confirmPassword, ...importantData } = data;
    dispatch(updateRegisterForm(importantData));
    router.push("/auth/register/step-3");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        mx: "auto",
        mt: 4,
      }}
    >
      {/* Title */}
      <Box>
        <Typography variant="body2" color="text.secondary">
          Step 2 of 3
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          Tạo Tài Khoản
        </Typography>
      </Box>

      {/* Email */}
      <TextField
        label="Email"
        type="email"
        fullWidth
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      {/* Password */}
      <TextField
        label="Mật khẩu"
        type={show ? "text" : "password"}
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShow((prev) => !prev)} edge="end">
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Confirm Password */}
      <TextField
        label="Xác nhận mật khẩu"
        type={showConfirm ? "text" : "password"}
        fullWidth
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirm((prev) => !prev)}
                edge="end"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Terms */}
      <FormHelperText sx={{ whiteSpace: "pre-line" }}>
        Bằng cách nhấn vào &quot;Tạo Tài Khoản&quot;, tôi cho phép Kiến Nội Thất
        liên hệ với tôi để cung cấp thêm thông tin về các sản phẩm, dịch vụ và
        sự kiện tại khu vực của tôi thông qua thông tin liên hệ mà tôi đã cung
        cấp. Tôi hiểu rằng các cuộc gọi hoặc tin nhắn có thể sử dụng hệ thống
        quay số tự động hoặc được hỗ trợ bởi máy tính, hoặc tin nhắn đã được ghi
        âm sẵn. Cước phí tin nhắn và dữ liệu thông thường vẫn được áp dụng. Tôi
        có thể từ chối nhận các thông tin này bất cứ lúc nào trong mục cài đặt
        hoặc bằng cách{" "}
        <span
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          hủy đăng ký
        </span>
        .
      </FormHelperText>

      {/* Next Button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={!isValid}
        sx={{ mt: 2 }}
      >
        Tiếp Theo
      </Button>
    </Box>
  );
}
export default RegisterStepTwo;
