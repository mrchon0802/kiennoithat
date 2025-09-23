"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateRegisterForm } from "../../store/userSlice";
import { useRouter } from "next/navigation";
import styles from "./RegisterStepOne.module.css";
import clsx from "clsx";
import { use, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
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
function RegisterStepOne({ onNext }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { firstName: "", lastName: "" },
  });

  const onSubmit = (data) => {
    dispatch(updateRegisterForm(data));

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
        variant="outlined"
        fullWidth
        {...register("firstName")}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />

      {/* Tên */}
      <TextField
        label="Tên"
        variant="outlined"
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

      {/* Button */}
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
export default RegisterStepOne;
