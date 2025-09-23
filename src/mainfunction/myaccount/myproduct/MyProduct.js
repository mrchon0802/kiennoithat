"use client";

import React, { useEffect } from "react";
import styles from "./MyProduct.module.css";
import PurchasedProductCard from "./PurchasedProductCard";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { addPurchasedProduct } from "../../../store/productSlice";

export default function MyProduct() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const currentId = useSelector((state) => state.login.currentId);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(
        addPurchasedProduct({
          userId: currentId,
          name: "Ghế Sofa Cao Cấp",
          material: "Gỗ tự nhiên",
          size: "2m x 1m",
          color: "Nâu",
          fabricColor: "Xám",
          fabricMaterial: "Vải nỉ",
          quanity: 1,
          price: "20.000.000 VNĐ",
          image: "/sofa-demo.jpg",
        })
      );
    }
  }, [currentId, dispatch, products.length]);

  const myProducts = products?.filter((p) => p.userId === currentId);
  return (
    <main className={styles.mainContent}>
      <h2>Sản Phẩm Của Tôi</h2>
      <div className={styles.productsGrid}>
        {myProducts.length > 0
          ? myProducts.map((product) => (
              <PurchasedProductCard key={product.id} product={product} />
            ))
          : "Chưa có sản phẩm"}
      </div>
    </main>
  );
}
