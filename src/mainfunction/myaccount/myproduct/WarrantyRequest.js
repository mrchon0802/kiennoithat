"use client";

import React, { useEffect, useState } from "react";
import styles from "./WarrantyRequest.module.css";
import clsx from "clsx";
import { useRouter, useParams } from "next/navigation";
import { addWarrantyRequest } from "../../../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";

export default function WarrantyRequest() {
  const router = useRouter();
  const dispatch = useDispatch();

  const params = useParams();
  const productId = params.productId;

  const products = useSelector((state) => state.products.products);
  const currentId = useSelector((state) => state.login.currentId);
  const currentProduct = products?.find(
    (p) => p.id === productId && p.userId === currentId
  );
  const [description, setDescription] = useState("");
  const existingRequest = currentProduct?.warrantyRequest;
  useEffect(() => {
    if (existingRequest?.content) setDescription(existingRequest.content);
  }, [existingRequest]);

  useEffect(() => {
    if (!productId || !currentProduct) {
      router.push("/my-account/my-product");
    }
  }, [productId, currentProduct, router.push]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim()) {
      return;
    }

    // gui action toi redux de luu yeu cau bao hanh
    dispatch(
      addWarrantyRequest({
        id: productId,
        content: description,
        createAt: existingRequest?.createAt || new Date().toISOString(),
      })
    );

    router.push(`/my-account/my-product/${productId}`);
  };
  const isActive = description !== "";
  return (
    <div className={styles.warrantyRequest}>
      <div className={styles.title}>
        <button
          className={styles.backBtn}
          onClick={() =>
            router.push("/my-account/my-product/purchased-product-detail")
          }
        >
          <ChevronLeft size={20} /> Quay lại
        </button>
        <h2>
          {existingRequest
            ? "Chỉnh Sửa Yêu Cầu Bảo Hành"
            : "Tạo Yêu Cầu Bảo Hành"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGroup}>
        <div className={styles.infoGroup}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Ngày Tạo Yêu Cầu</span>
            <span className={styles.value}>
              {existingRequest?.createAt
                ? new Date(existingRequest.createAt).toLocaleDateString("vi-VN")
                : new Date().toLocaleDateString("vi-VN")}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Mô Tả Chi Tiêt </span>
            <textarea
              placeholder=""
              className={styles.textareaAuto}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto"; // reset
                e.target.style.height = `${e.target.scrollHeight}px`; // giãn theo nội dung
              }}
            />
          </div>
        </div>
        <div className={styles.formActions}>
          <button
            type="submit"
            className={clsx(styles.btnUpdate, isActive && styles.active)}
          >
            Cập nhật
          </button>
          <button
            type="button"
            className={styles.btnCancel}
            onClick={() => router.push(`/my-account/my-product/${productId}`)}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
