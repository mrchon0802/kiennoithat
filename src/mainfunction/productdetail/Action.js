"use client";

import React from "react";
import styles from "./styles/Action.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button, Box } from "@mui/material";
import {
  addOrder,
  updateSelectingOrder,
  clearSelectingOrder,
} from "@/store/orderSlice";

function Action({ finalPrice }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const users = useSelector((state) => state.users.users);
  const currentLogin = useSelector((state) => state.login.currentId);
  const currentUser = users?.find((u) => u.id === currentLogin);

  const selectingOrder = useSelector((state) => state.orders.selectingOrder);

  const handleSubmit = () => {
    if (!currentUser) {
      router.push("/auth");
    } else {
      dispatch(addOrder(selectingOrder));

      //xoa du lieu selectingOrder
      dispatch(clearSelectingOrder());
      router.push("/shopping-cart");
    }
  };
  if (finalPrice == null) return null;
  return (
    <Box className={styles.action}>
      <Box className={styles.actionSection}>
        <span>
          <strong>{finalPrice.toLocaleString()}</strong> VND
        </span>
      </Box>
      <Button
        variant="contained"
        color="primary"
        className={styles.orderBtn}
        onClick={() => handleSubmit()}
      >
        Mua Ngay
      </Button>
    </Box>
  );
}
export default Action;
