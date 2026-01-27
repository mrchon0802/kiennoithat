"use client";

import React, { useCallback } from "react";
import styles from "./styles/Action.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button, Box } from "@mui/material";
import { addToCart } from "@/store/cartSlice";
import type { RootState, AppDispatch } from "@/store/store";
import type { SelectingOrder } from "@/type/SelectingOrder";

/* ===================== TYPES ===================== */

interface ActionProps {
  finalPrice: number;
  selectingOrder: SelectingOrder | null;
}

/* ===================== COMPONENT ===================== */

const Action: React.FC<ActionProps> = ({ finalPrice, selectingOrder }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.login.user);

  const fullAddress = currentUser?.fullAddress ?? "";

  /* ===================== HANDLERS ===================== */

  const handleSubmit = useCallback(async () => {
    if (!currentUser) {
      router.push("/auth");
      return;
    }

    if (!fullAddress) {
      router.push("/account-settings/personal-infomation");
      return;
    }

    if (!selectingOrder) return; // 🔒 null-safe

    try {
      await dispatch(
        addToCart({
          userId: currentUser._id,
          items: [selectingOrder],
        }),
      ).unwrap();

      router.push("/cart");
    } catch (err) {
      console.error("Error when adding to cart", err);
    }
  }, [currentUser, fullAddress, selectingOrder, dispatch, router]);

  /* ===================== RENDER ===================== */

  if (!finalPrice) return null;

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
        onClick={handleSubmit}
        disabled={!selectingOrder} // UX tốt hơn
      >
        Mua Ngay
      </Button>
    </Box>
  );
};

export default React.memo(Action);
