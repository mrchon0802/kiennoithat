"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
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

export default function Cart() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { items: cart, loading } = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.login.user);
  const fullAddress = currentUser?.fullAddress || "";

  useEffect(() => {
    if (!currentUser) router.push("/auth");
    else if (!fullAddress) router.push("/account-settings/personal-infomation");
  }, [currentUser, fullAddress, router]);

  //fetch giỏ hàng khi user thay đổi
  useEffect(() => {
    if (currentUser?._id) dispatch(fetchCart(currentUser._id));
  }, [dispatch, currentUser]);

  const [error, setError] = useState("");
  const [shippingFees, setShippingFees] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  const fromDistrictId = Number(process.env.NEXT_PUBLIC_GHN_SHOP_DISTRICT_ID);
  const toDistrictId = Number(currentUser?.toDistrictId);
  const toWardCode = String(currentUser?.toWardCode);

  const fetchShipingFee = useMemo(
    () =>
      debounce(async () => {
        if (!cart.length || !toDistrictId || !toWardCode) return;

        const feePromises = cart.map(async (item) => {
          const weight = Number(item.weight) * 1000 || 1000; // kg → gram
          const length = Number(item.length) * 100 || 30; // m → cm
          const width = Number(item.width) * 100 || 20; // m → cm
          const height = Number(item.height) * 100 || 15; // m → cm

          try {
            console.log("GHN body:", {
              name: item.name,
              weight,
              length,
              width,
              height,
            });

            const res = await axios.post("/api/shipping", {
              service_type_id: 2,
              insurance_value: 1000000,
              coupon: null,
              from_district_id: fromDistrictId,
              to_district_id: toDistrictId,
              to_ward_code: toWardCode,
              height,
              length,
              weight,
              width,
            });
            return res.data?.fee ?? 0;
          } catch (err) {
            console.error("Shipping fee error", err);
            return 0;
          }
        });

        const results = await Promise.all(feePromises);
        setShippingFees(results);
      }, 500),
    [cart, toDistrictId, toWardCode, fromDistrictId]
  );

  useEffect(() => {
    fetchShipingFee();
    return () => fetchShipingFee.cancel();
  }, [fetchShipingFee]);

  // gia của từng đơn
  const itemsWithTotal = useMemo(() => {
    return cart.map((item, i) => {
      const baseShipping =
        Array.isArray(shippingFees) && shippingFees[i] ? shippingFees[i] : 0;

      const shipping = baseShipping * (Number(item.quantity) || 1);
      const itemSubtotal =
        (Number(item.price) || 0) * (Number(item.quantity) || 1);
      return {
        ...item,
        shipping,
        itemSubtotal,
        itemTotal: itemSubtotal + shipping,
      };
    });
  }, [cart, shippingFees]);

  //  Tổng đơn
  const grandTotal = useMemo(() => {
    return itemsWithTotal.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
  }, [itemsWithTotal]);

  // --- Handlers ---
  const handleQuantityChange = (productId, size, color, value) => {
    const newQuantity = Math.max(1, Number(value));
    dispatch(
      updateCartItem({
        userId: currentUser._id,
        productId,
        size,
        color,
        quantity: newQuantity,
      })
    );
  };

  const handleRemoveItem = (productId, size, color) => {
    if (!currentUser?._id) return;
    console.log("🗑 remove:", {
      productId,
      size,
      color,
      userId: currentUser._id,
    });

    dispatch(
      removeFromCart({ userId: currentUser._id, productId, size, color })
    );
  };

  const handleClearCart = () => {
    dispatch(clearCart(currentUser._id));
  };

  const handleSubmitOrder = async () => {
    const orderData = {
      userId: currentUser._id,
      items: cart,
      shippingFee: grandTotal,
      total: grandTotal,
    };

    const result = await dispatch(createOrder(orderData));

    if (result.meta.requestStatus === "fulfilled") {
      console.log("Đặt hàng thành công!");
      dispatch(clearCart(currentUser._id));
      router.push("/orders");
    } else {
      console.log("Đặt hàng thất bại, vui lòng thử lại!");
    }
  };

  // --- Render ---
  if (loading)
    return <div className={styles.loading}>Đang tải giỏ hàng...</div>;

  if (!cart?.length) return <div className={styles.empty}>Giỏ hàng trống</div>;

  return (
    <div className={styles.container}>
      <div className={styles.shoppingCart}>
        <h2>Giỏ hàng</h2>

        {itemsWithTotal.map((item) => (
          <div key={`${item.productId}-${item.size}-${item.color}`}>
            <div className={styles.cardItem}>
              <div className={styles.card}>
                <Image
                  src={item.image}
                  alt={item.name}
                  className={styles.image}
                  width={110}
                  height={110}
                />

                <div className={styles.info}>
                  <h4 className={styles.name}>{item.name}</h4>
                  <span className={styles.variant}>{item.color}</span>
                  <p className={styles.price}>
                    {item.price.toLocaleString()} đ
                  </p>
                </div>

                <div className={styles.actions}>
                  <div className={styles.quantityControl}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() =>
                        handleQuantityChange(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                    >
                      –
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() =>
                        handleQuantityChange(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <Trash
                    size={18}
                    className={styles.removeBtn}
                    onClick={() =>
                      handleRemoveItem(item.productId, item.size, item.color)
                    }
                  />
                </div>
              </div>
              <div className={styles.divider}>
                <span></span>
              </div>
              <div className={styles.shippingRow}>
                <div>
                  <span>Phí vận chuyển: </span>
                  <span className={styles.shippingFee}>
                    {Number(item.shipping || 0).toLocaleString()} đ
                  </span>
                </div>
                <div>
                  <span> Số tiền: </span>
                  <span className={styles.totalFee}>
                    {Number(item.itemTotal || 0).toLocaleString()} đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className={styles.footer}>
          <div className={styles.summary}>
            <span>Tổng cộng: </span>
            <h4> {grandTotal.toLocaleString()} đ</h4>
          </div>
          <div className={styles.submits}>
            {" "}
            <button
              className={`${styles.btn} ${styles.clear}`}
              onClick={handleClearCart}
            >
              Xóa giỏ hàng
            </button>
            <button
              className={`${styles.btn} ${styles.order}`}
              onClick={handleSubmitOrder}
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
