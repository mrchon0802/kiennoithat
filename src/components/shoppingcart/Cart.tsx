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
import { Trash, ShoppingBag } from "lucide-react";
import { debounce } from "lodash";
import Image from "next/image";
import type { ShoppingCartItem } from "@/type/Cart.ui";
import type { PaymentMethod } from "@/type/Order";

const ShoppingBagIcon = () => <ShoppingBag size={34} strokeWidth={1.5} />;

const Cart: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { items: cart, loading } = useSelector(
    (state: RootState) => state.cart,
  );
  const currentUser = useSelector((state: RootState) => state.login.user);
  const authInitialized = useSelector(
    (state: RootState) => state.login.initialized,
  );

  const fullAddress = currentUser?.fullAddress ?? "";

  // Wait for cookie-based session restoration before redirecting guests.
  useEffect(() => {
    if (authInitialized && !currentUser) {
      router.replace(`/auth?returnTo=${encodeURIComponent("/cart")}`);
    }
  }, [authInitialized, currentUser, router]);

  // Fetch only after the auth restoration check is complete.
  useEffect(() => {
    if (authInitialized && currentUser?._id) {
      dispatch(fetchCart(currentUser._id));
    }
  }, [dispatch, authInitialized, currentUser?._id]);

  const [shippingFees, setShippingFees] = useState<number[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);

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
    if (!currentUser?._id || !cart.length || submitting) return;
    if (!fullAddress || !toDistrictId || !toWardCode || !currentUser.phoneNumber) {
      router.push("/account-settings/personal-infomation");
      return;
    }

    const subtotal = itemsWithTotal.reduce((sum, item) => sum + item.itemSubtotal, 0);
    const shippingFee = itemsWithTotal.reduce((sum, item) => sum + item.shipping, 0);
    const orderItems = cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: Number(item.price),
      quantity: Number(item.quantity),
      size: item.size ?? "",
      color: item.color ?? "",
    }));

    setSubmitting(true);
    try {
      const result = await dispatch(createOrder({
        items: orderItems,
        shippingAddress: {
          fullName: [currentUser.firstName, currentUser.lastName].filter(Boolean).join(" ") || currentUser.email,
          phoneNumber: currentUser.phoneNumber,
          address: fullAddress,
          districtId: toDistrictId,
          wardCode: toWardCode,
        },
        shippingFee,
        discount: 0,
        paymentMethod,
      })).unwrap();

      dispatch(clearCart(currentUser._id));
      router.push(`/my-account/order-history/${result.order._id}`);
    } catch (error) {
      console.error("Create order failed:", error);
      alert(typeof error === "string" ? error : "Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // render
  if (!authInitialized || !currentUser) {
    return (
      <main className={styles.page}>
        <section className={styles.shoppingCart}>
          <div className={styles.loading}>
            <span className={styles.spinner} />
            <p>Đang kiểm tra đăng nhập...</p>
          </div>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <section className={styles.shoppingCart}>
          <div className={styles.loading}>
            <span className={styles.spinner} />
            <p>Đang tải giỏ hàng...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.shoppingCart}>
        <div className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>KIỂM TRA SẢN PHẨM</span>
            <h2>Giỏ hàng</h2>
            <p className={styles.subtitle}>
              {cart.length
                ? `${cart.length} sản phẩm trong giỏ hàng của bạn`
                : "Các sản phẩm bạn chọn sẽ xuất hiện tại đây"}
            </p>
          </div>
        </div>

        {!cart.length ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <ShoppingBagIcon />
            </div>
            <h3>Giỏ hàng đang trống</h3>
            <p>Hãy khám phá các sản phẩm và chọn món đồ bạn yêu thích nhé.</p>
            <button
              type="button"
              className={styles.continueButton}
              onClick={() => router.push("/")}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {itemsWithTotal.map((item) => (
                <article
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className={styles.cardItem}
                >
                  <div className={styles.card}>
                    <div className={styles.imageWrap}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={120}
                        height={120}
                        className={styles.image}
                      />
                    </div>

                    <div className={styles.info}>
                      <h3 className={styles.name}>{item.name}</h3>
                      <div className={styles.variantList}>
                        {item.size && (
                          <span className={styles.variant}>
                            Kích thước: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className={styles.variant}>
                            Màu sắc: {item.color}
                          </span>
                        )}
                      </div>
                      <p className={styles.price}>
                        {Number(item.price).toLocaleString("vi-VN")} ₫
                      </p>
                    </div>

                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          aria-label="Giảm số lượng"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.size,
                              item.color,
                              item.quantity - 1,
                            )
                          }
                        >
                          −
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          type="button"
                          className={styles.qtyBtn}
                          aria-label="Tăng số lượng"
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
                      </div>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        aria-label={`Xóa ${item.name}`}
                        onClick={() =>
                          handleRemoveItem(
                            item.productId,
                            item.size,
                            item.color,
                          )
                        }
                      >
                        <Trash size={18} />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.shippingRow}>
                    <span>Phí vận chuyển</span>
                    <strong>{item.shipping.toLocaleString("vi-VN")} ₫</strong>
                    <span className={styles.lineTotalLabel}>Thành tiền</span>
                    <strong className={styles.lineTotal}>
                      {item.itemTotal.toLocaleString("vi-VN")} ₫
                    </strong>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryInfo}>
                <span className={styles.summaryLabel}>Tổng thanh toán</span>
                <strong className={styles.summaryAmount}>
                  {grandTotal.toLocaleString("vi-VN")} ₫
                </strong>
                <span className={styles.note}>
                  Đã bao gồm phí vận chuyển ước tính
                </span>
              </div>
              <div className={styles.paymentChoice}>
                <label htmlFor="cart-payment-method">Phương thức thanh toán</label>
                <select
                  id="cart-payment-method"
                  value={paymentMethod}
                  onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
                >
                  <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                  <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                </select>
              </div>
              <button
                type="button"
                className={styles.order}
                onClick={handleSubmitOrder}
                disabled={submitting}
              >
                {submitting ? "Đang tạo đơn..." : "Đặt hàng"}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Cart;
