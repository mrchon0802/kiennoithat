"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import axios from "axios";
import {
  fetchCart,
  updateCartItem,
  clearCart,
  removeFromCart,
} from "@/store/cartSlice";
import { createOrder } from "@/store/orderSlice";
import styles from "./Cart.module.css";
import { Trash } from "lucide-react";
import { debounce } from "lodash";
import Image from "next/image";
import type { ShoppingCartItem } from "@/type/Cart.ui";

const Cart: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { items: cart, loading } = useSelector(
    (state: RootState) => state.cart,
  );
  const currentUser = useSelector((state: RootState) => state.login.user);

  const fullAddress = currentUser?.fullAddress ?? "";

  // redirect
  useEffect(() => {
    if (!currentUser) router.push("/auth");
    else if (!fullAddress) router.push("/account-settings/personal-infomation");
  }, [currentUser, fullAddress, router]);

  // fetch cart
  useEffect(() => {
    if (currentUser?._id) {
      dispatch(fetchCart(currentUser._id));
    }
  }, [dispatch, currentUser?._id]);

  const [shippingFees, setShippingFees] = useState<number[]>([]);

  const fromDistrictId = Number(process.env.NEXT_PUBLIC_GHN_SHOP_DISTRICT_ID);
  const toDistrictId = Number(currentUser?.toDistrictId);
  const toWardCode = String(currentUser?.toWardCode ?? "");

  // fetch shipping fee
  const fetchShippingFee = useMemo(
    () =>
      debounce(async () => {
        if (!cart.length || !toDistrictId || !toWardCode) return;

        const feePromises = cart.map(async (item: ShoppingCartItem) => {
          const weight = Number(item.weight) * 1000 || 1000;
          const length = Number(item.length) * 100 || 30;
          const width = Number(item.width) * 100 || 20;
          const height = Number(item.height) * 100 || 15;

          try {
            const res = await axios.post("/api/shipping", {
              service_type_id: 2,
              insurance_value: 1_000_000,
              from_district_id: fromDistrictId,
              to_district_id: toDistrictId,
              to_ward_code: toWardCode,
              height,
              length,
              weight,
              width,
            });

            return res.data?.fee ?? 0;
          } catch {
            return 0;
          }
        });

        const results = await Promise.all(feePromises);
        setShippingFees(results);
      }, 500),
    [cart, toDistrictId, toWardCode, fromDistrictId],
  );

  useEffect(() => {
    fetchShippingFee();
    return () => fetchShippingFee.cancel();
  }, [fetchShippingFee]);

  // items with total
  const itemsWithTotal = useMemo(() => {
    return cart.map((item, i) => {
      const baseShipping = shippingFees[i] ?? 0;
      const quantity = Number(item.quantity) || 1;

      const shipping = baseShipping * quantity;
      const itemSubtotal = Number(item.price) * quantity;

      return {
        ...item,
        shipping,
        itemSubtotal,
        itemTotal: itemSubtotal + shipping,
      };
    });
  }, [cart, shippingFees]);

  // grand total
  const grandTotal = useMemo(
    () => itemsWithTotal.reduce((sum, item) => sum + (item.itemTotal || 0), 0),
    [itemsWithTotal],
  );

  // handlers
  const handleQuantityChange = (
    productId: string,
    size: string,
    color: string,
    value: number,
  ) => {
    if (!currentUser?._id) return;

    dispatch(
      updateCartItem({
        userId: currentUser._id,
        productId,
        size,
        color,
        quantity: Math.max(1, value),
      }),
    );
  };

  const handleRemoveItem = (productId: string, size: string, color: string) => {
    if (!currentUser?._id) return;

    dispatch(
      removeFromCart({
        userId: currentUser._id,
        productId,
        size,
        color,
      }),
    );
  };

  const handleClearCart = () => {
    if (currentUser?._id) {
      dispatch(clearCart(currentUser._id));
    }
  };

  const handleSubmitOrder = async () => {
    if (!currentUser?._id) return;
    const orderItems = cart.map((item) => ({
      productId: item.productId,
      title: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));
    const result = await dispatch(
      createOrder({
        userId: currentUser._id,
        items: orderItems,
        shippingFee: grandTotal,
        totalPrice: grandTotal,
      }),
    );

    if (result.meta.requestStatus === "fulfilled") {
      dispatch(clearCart(currentUser._id));
      router.push("/orders");
    }
  };

  // render
  if (loading)
    return <div className={styles.loading}>Đang tải giỏ hàng...</div>;

  if (!cart.length) return <div className={styles.empty}>Giỏ hàng trống</div>;

  return (
    <div className={styles.container}>
      <div className={styles.shoppingCart}>
        <h2>Giỏ hàng</h2>

        {itemsWithTotal.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.color}`}
            className={styles.cardItem}
          >
            <div className={styles.card}>
              <Image
                src={item.image}
                alt={item.name}
                width={110}
                height={110}
              />

              <div className={styles.info}>
                <h4>{item.name}</h4>
                <span>{item.color}</span>
                <p>{item.price.toLocaleString()} đ</p>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.productId,
                      item.size,
                      item.color,
                      item.quantity - 1,
                    )
                  }
                >
                  –
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.productId,
                      item.size,
                      item.color,
                      item.quantity + 1,
                    )
                  }
                >
                  +
                </button>

                <Trash
                  size={18}
                  onClick={() =>
                    handleRemoveItem(item.productId, item.size, item.color)
                  }
                />
              </div>
            </div>

            <div className={styles.shippingRow}>
              <span>Phí vận chuyển: {item.shipping.toLocaleString()} đ</span>
              <span>Thành tiền: {item.itemTotal.toLocaleString()} đ</span>
            </div>
          </div>
        ))}

        <div className={styles.footer}>
          <h4>Tổng cộng: {grandTotal.toLocaleString()} đ</h4>

          <button onClick={handleClearCart}>Xóa giỏ hàng</button>
          <button onClick={handleSubmitOrder}>Đặt hàng</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
