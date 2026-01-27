"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./WarrantyRequest.module.css";
import clsx from "clsx";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";

import type { RootState, AppDispatch } from "@/store/store";
import { addWarrantyRequest } from "@/store/productSlice";

export default function WarrantyRequest() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams<{ productId: string }>();

  const productId = params?.productId;

  // 👤 user hiện tại
  const currentUserId = useSelector(
    (state: RootState) => state.login.user?._id,
  );

  // 📦 products
  const products = useSelector((state: RootState) => state.products.products);

  /**
   * 🔍 tìm product thuộc user hiện tại
   */
  const currentProduct = useMemo(() => {
    if (!productId || !currentUserId) return undefined;

    return products.find(
      (p) => p.id === productId && p.userId === currentUserId,
    );
  }, [products, productId, currentUserId]);

  const existingRequest = currentProduct?.warrantyRequest;

  const [description, setDescription] = useState("");

  /**
   * Prefill content nếu đã có warranty request
   */
  useEffect(() => {
    if (existingRequest?.content) {
      setDescription(existingRequest.content);
    }
  }, [existingRequest]);

  /**
   * Guard: không có product → quay về list
   * (chỉ chạy khi data đã sẵn sàng)
   */
  useEffect(() => {
    if (!productId) return;

    if (products.length > 0 && !currentProduct) {
      router.replace("/my-account/my-product");
    }
  }, [productId, currentProduct, products.length, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!description.trim() || !productId) return;

    dispatch(
      addWarrantyRequest({
        id: productId,
        content: description.trim(),
        // createdAt: existingRequest?.createdAt ?? new Date().toISOString(),
      }),
    );

    router.push(`/my-account/my-product/${productId}`);
  };

  const isActive = description.trim().length > 0;

  return (
    <div className={styles.warrantyRequest}>
      {/* ===== Header ===== */}
      <div className={styles.title}>
        <button
          className={styles.backBtn}
          onClick={() => router.push(`/my-account/my-product/${productId}`)}
        >
          <ChevronLeft size={20} />
          Quay lại
        </button>

        <h2>
          {existingRequest
            ? "Chỉnh Sửa Yêu Cầu Bảo Hành"
            : "Tạo Yêu Cầu Bảo Hành"}
        </h2>
      </div>

      {/* ===== Form ===== */}
      <form onSubmit={handleSubmit} className={styles.formGroup}>
        <div className={styles.infoGroup}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Ngày Tạo Yêu Cầu</span>
            <span className={styles.value}>
              {new Date(
                existingRequest?.createdAt ?? Date.now(),
              ).toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Mô Tả Chi Tiết</span>
            <textarea
              className={styles.textareaAuto}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onInput={(e) => {
                const target = e.currentTarget;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={clsx(styles.btnUpdate, isActive && styles.active)}
            disabled={!isActive}
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
