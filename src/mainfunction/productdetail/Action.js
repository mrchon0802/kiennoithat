"use client";

import React from "react";
import styles from "./styles/Action.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button, Box } from "@mui/material";
import { addToCart } from "@/store/cartSlice";
function Action({ finalPrice, selectingOrder }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const currentUser = useSelector((state) => state.login.user);
  const fullAddress = currentUser?.fullAddress || "";

  console.log("selectingOrder", selectingOrder);
  const handleSubmit = async () => {
    if (!currentUser) {
      router.push("/auth");
      return;
    }

    if (!fullAddress) {
      router.push("/account-settings/personal-infomation");
      return;
    }

    try {
      await dispatch(
        addToCart({
          userId: currentUser._id,
          items: [selectingOrder],
        })
      ).unwrap();
    } catch (err) {
      console.error("Error when adding to cart", err);
    }

    router.push("/cart");
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
