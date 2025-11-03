"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearRegisterForm, createUser } from "../../store/userSlice";
import { loginStart, loginSuccess, loginFailure } from "../../store/loginSlice";
import styles from "./RegisterStepThree.module.css";
import clsx from "clsx";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from "@mui/material";
import { userApi } from "@/api/userApi";

function RegisterStepThree() {
  const dispatch = useDispatch();
  const router = useRouter();

  const registerForm = useSelector((state) => state.users.registerForm);
  const loginState = useSelector((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginStart());
      console.log("Data sent to backend:", registerForm);

      const newUser = await dispatch(createUser(registerForm)).unwrap();
      console.log(" User created:", newUser);

      const res = await userApi.login(
        registerForm.email,
        registerForm.password
      );
      const authData = res.data;

      dispatch(loginSuccess(authData));

      //xoa du lieu registerform
      dispatch(clearRegisterForm());

      router.push("/my-account");
    } catch (err) {
      console.error("Lỗi khi gửi user:", err);
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
          Nhập code vừa được gửi dến email {registerForm.email}
        </FormHelperText>
        <TextField
          type="text"
          className={styles.verifyInput}
          label="Enter verification code"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          className={clsx(styles.btn, styles.resendcodeBtn)}
        >
          Đăng Kí
        </Button>
      </form>
    </Box>
  );
}
export default RegisterStepThree;
