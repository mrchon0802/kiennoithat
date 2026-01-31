"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from "@mui/material";

import { updateRegisterForm } from "../../store/userSlice";
import type { AppDispatch } from "@/store/store";

// --------------------
// Types
// --------------------
interface RegisterStepOneValues {
  firstName?: string;
  lastName?: string;
}

// (nếu sau này dùng multi-step controlled)
interface RegisterStepOneProps {
  onNext?: () => void;
}

// --------------------
// Validation schema
// --------------------
const schema: yup.ObjectSchema<RegisterStepOneValues> = yup.object({
  firstName: yup
    .string()
    .trim()
    .required("Vui lòng nhập họ")
    .min(2, "Họ phải có ít nhất 2 kí tự"),
  lastName: yup
    .string()
    .trim()
    .required("Vui lòng nhập tên")
    .min(1, "Tên phải có ít nhất 1 kí tự"),
});

// --------------------
// Component
// --------------------
const RegisterStepOne: React.FC<RegisterStepOneProps> = ({ onNext }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterStepOneValues>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterStepOneValues> = (data) => {
    dispatch(updateRegisterForm(data));
    onNext?.();
    router.push("/auth/register/step-2");
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
      <Box>
        <Typography variant="body2" color="text.secondary">
          Step 1 of 3
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          Tạo Tài Khoản
        </Typography>
      </Box>

      {/* Họ */}
      <TextField
        label="Họ"
        fullWidth
        {...register("firstName")}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />

      {/* Tên */}
      <TextField
        label="Tên"
        fullWidth
        {...register("lastName")}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />

      <FormHelperText sx={{ whiteSpace: "pre-line" }}>
        Bằng cách nhấp vào Tiếp Theo, tôi hiểu và đồng ý với{" "}
        <span
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Thông báo Quyền riêng tư
        </span>{" "}
        và{" "}
        <span
          style={{
            fontWeight: "bold",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Điều khoản Sử dụng
        </span>{" "}
        của Kiến nội thất để tạo Tài khoản Kiến nội thất và tôi ủy quyền cho
        Kiến nội thất liên hệ với tôi để quản lý tài khoản thông qua thông tin
        liên lạc tôi cung cấp.
      </FormHelperText>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!isValid}
        sx={{ mt: 2 }}
      >
        Tiếp Theo
      </Button>
    </Box>
  );
};

export default RegisterStepOne;
