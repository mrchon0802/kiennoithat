"use client";

import React, { useCallback } from "react";
import styles from "./styles/Action.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addToCart } from "@/store/cartSlice";
import type { RootState, AppDispatch } from "@/store/store";
import type { SelectingOrder } from "@/type/SelectingOrder";

/* ===================== TYPES ===================== */

interface ActionProps {
  productTitle: string;
  finalPrice: number;
  selectingOrder: SelectingOrder | null;
}

/* ===================== COMPONENT ===================== */

const Action: React.FC<ActionProps> = ({
  productTitle,
  finalPrice,
  selectingOrder,
}) => {
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
    <div className={styles.action}>
      {/* Div 1 — tên sản phẩm */}
      <div className={styles.titleName}>
        <h3>{productTitle}</h3>
      </div>

      {/* Div 2 — giá + nút Mua ngay */}
      <div className={styles.actionRight}>
        <div className={styles.actionSection}>
          <span>
            <strong>{finalPrice.toLocaleString("vi-VN")}</strong> vnd
          </span>
        </div>

        <button
          type="button"
          className={styles.orderBtn}
          onClick={handleSubmit}
          disabled={!selectingOrder}
        >
          Mua Ngay
        </button>
      </div>
    </div>
  );
};

export default React.memo(Action);
