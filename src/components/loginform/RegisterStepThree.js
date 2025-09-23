"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addUser, clearRegisterForm } from "../../store/userSlice";
import { login } from "../../store/loginSlice";
import styles from "./RegisterStepThree.module.css";
import clsx from "clsx";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormHelperText,
} from "@mui/material";

function RegisterStepThree() {
  const dispatch = useDispatch();
  const router = useRouter();

  const registerForm = useSelector((state) => state.users.registerForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { ...registerForm, id: Date.now() };
    //them user moi vao store
    dispatch(addUser(newUser));
    //dat currentId de login
    dispatch(login(newUser.id));
    //xoa du lieu registerform
    dispatch(clearRegisterForm());

    router.push("/my-account");
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
          Gửi Lại Code
        </Button>
      </form>
    </Box>
  );
}
export default RegisterStepThree;
