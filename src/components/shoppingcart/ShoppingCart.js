"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import styles from "./ShoppingCart.module.css";

function ShoppingCart() {
  const router = useRouter();
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.orders.orders);
  const users = useSelector((state) => state.users.users);

  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    if (user?.shippingAddress && cart.length > 0) {
      // giả sử gọi API GHN tính phí ship
      const calcShipping = async () => {
        try {
          const res = await fetch("/api/shipping", {
            method: "POST",
            body: JSON.stringify({
              address: user.shippingAddress,
              items: cart,
            }),
          });
          const data = await res.json();
          setShippingFee(data.fee || 0);
        } catch (err) {
          console.error("Error calculating shipping:", err);
        }
      };
      calcShipping();
    }
  }, [user?.shippingAddress, cart]);

  if (cart.length === 0) {
    return <div className={styles.empty}>Giỏ hàng trống</div>;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingFee;

  return (
    <div className={styles.cartContainer}>
      <h2>Giỏ hàng</h2>

      <div className={styles.cartItems}>
        {cart.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <p>{item.name}</p>
            <p>
              {item.quantity} × {item.price.toLocaleString()}đ
            </p>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <p>Tạm tính: {subtotal.toLocaleString()}đ</p>

        {user?.shippingAddress ? (
          <>
            <p>Phí ship: {shippingFee.toLocaleString()}đ</p>
            <p>
              <strong>Tổng: {total.toLocaleString()}đ</strong>
            </p>
            <button className={styles.checkoutBtn}>Thanh toán</button>
          </>
        ) : (
          <>
            {user?.id ? (
              <button
                onClick={() => router.push("/account/change-address")}
                className={styles.updateAddressBtn}
              >
                Cập nhật địa chỉ để tính phí ship
              </button>
            ) : (
              <button
                onClick={() => router.push("/auth")}
                className={styles.loginBtn}
              >
                Đăng nhập để tiếp tục
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;
