"use client";

import React, { useEffect, useMemo } from "react";
import styles from "./MyProduct.module.css";
import PurchasedProductCard from "./PurchasedProductCard";
import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store/store";
import { addPurchasedProduct } from "@/store/productSlice";

const MyProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 👤 User hiện tại
  const currentUser = useSelector((state: RootState) => state.login.user);
  const currentUserId = currentUser?._id;

  // 📦 Products từ Redux (DOMAIN TYPE)
  const products = useSelector((state: RootState) => state.products.products);

  /**
   * Seed demo product (chỉ khi chưa có)
   */
  useEffect(() => {
    if (!currentUserId || products.length > 0) return;

    dispatch(
      addPurchasedProduct({
        userId: currentUserId,
        productId: "Ghế Sofa Cao Cấp",
        name: "Ghế Sofa Cao Cấp",
        material: "Gỗ tự nhiên",
        size: "2m x 1m",
        color: "Nâu",
        fabricColor: "Xám",
        fabricMaterial: "Vải nỉ",
        quantity: 1, // ✅ FIX typo
        price: 20000000, // ✅ number
        image: "/sofa-demo.jpg",
      }),
    );
  }, [currentUserId, products.length, dispatch]);

  /**
   * Lọc sản phẩm của user hiện tại
   */
  const myProducts = useMemo(() => {
    if (!currentUserId) return [];
    return products.filter((product) => product.userId === currentUserId);
  }, [products, currentUserId]);

  return (
    <main className={styles.mainContent}>
      <h2>Sản Phẩm Của Tôi</h2>

      <div className={styles.productsGrid}>
        {myProducts.length > 0 ? (
          myProducts.map((product) => (
            <PurchasedProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Chưa có sản phẩm</p>
        )}
      </div>
    </main>
  );
};

export default MyProduct;
