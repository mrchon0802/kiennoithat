"use client";

import React, { useCallback } from "react";
import styles from "./styles/Action.module.css";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { addToCart } from "@/store/cartSlice";
import type { RootState, AppDispatch } from "@/store/store";
import type { SelectingOrder } from "@/type/SelectingOrder";
import { mapSelectingOrderToCartItem } from "@/mapper/cart.mapper";

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
  const pathname = usePathname();

  const currentUser = useSelector((state: RootState) => state.login.user);

  /* ===================== HANDLERS ===================== */

  const handleSubmit = useCallback(async () => {
    if (!currentUser) {
      const returnTo = pathname || "/";
      router.push(`/auth?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }

    if (!selectingOrder) return;

    try {
      await dispatch(
        addToCart({
          userId: currentUser._id,
          items: [mapSelectingOrderToCartItem(selectingOrder)],
        }),
      ).unwrap();

      router.push("/cart");
    } catch (err) {
      console.error("Error when adding to cart", err);
    }
  }, [currentUser, selectingOrder, dispatch, router, pathname]);

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
