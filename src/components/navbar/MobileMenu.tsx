// components/NavBar/MobileMenu.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, ChevronRight, ChevronLeft, User } from "lucide-react";
import styles from "./MobileMenu.module.css";
import { PRODUCT_CATEGORIES } from "./categories";
import {
  fetchAllProducts,
  getHeroProductsByRoom,
  formatPrice,
  Product,
} from "./productsCache";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

type Category = (typeof PRODUCT_CATEGORIES)[number];

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose }) => {
  const [activeCat, setActiveCat] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Reset về menu chính mỗi khi drawer đóng lại
  useEffect(() => {
    if (!open) {
      setActiveCat(null);
      setProducts([]);
    }
  }, [open]);

  const openCategory = async (cat: Category) => {
    setActiveCat(cat);
    setLoading(true);
    try {
      const all = await fetchAllProducts();
      setProducts(getHeroProductsByRoom(all, cat.room));
    } catch (err) {
      console.error("[MobileMenu] fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const backToList = () => {
    setActiveCat(null);
    setProducts([]);
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={onClose}
      />

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
        {/* ── Header: đổi tuỳ theo đang ở list hay category ── */}
        <div className={styles.drawerHeader}>
          {activeCat ? (
            <>
              <button
                className={styles.iconBtn}
                onClick={backToList}
                aria-label="Quay lại"
              >
                <ChevronLeft size={22} />
              </button>
              <span className={styles.headerTitle}>{activeCat.label}</span>
            </>
          ) : (
            <span className={styles.headerTitle} />
          )}
          <button
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* ── Màn hình 1: danh sách category ── */}
        {!activeCat && (
          <>
            <div className={styles.menuList}>
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  className={styles.menuItem}
                  onClick={() => openCategory(cat)}
                >
                  <span>{cat.label}</span>
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>

            <div className={styles.divider} />

            <Link
              href="/my-account"
              className={styles.accountItem}
              onClick={onClose}
            >
              <User size={20} />
              <span>Account</span>
            </Link>
          </>
        )}

        {/* ── Màn hình 2: sản phẩm nổi bật của category ── */}
        {activeCat && (
          <>
            <div className={styles.categoryGrid}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonImg} />
                    <div
                      className={styles.skeletonLine}
                      style={{ width: "70%" }}
                    />
                    <div
                      className={styles.skeletonLine}
                      style={{ width: "45%" }}
                    />
                  </div>
                ))
              ) : products.length > 0 ? (
                products.map((p) => (
                  <Link
                    key={p.productId}
                    href={`/san-pham/${p.productId}`}
                    className={styles.productCard}
                    onClick={onClose}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      className={styles.productImg}
                    />
                    <div className={styles.productName}>{p.title}</div>
                    <div className={styles.productPrice}>
                      {formatPrice(p.price)}
                    </div>
                    <div className={styles.productActions}>
                      <span className={styles.btnLearn}>Xem</span>
                      <span className={styles.btnOrder}>Đặt hàng</span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className={styles.emptyNote}>Chưa có sản phẩm.</p>
              )}
            </div>

            <Link
              href={`/san-pham?room=${activeCat.room}`}
              className={styles.viewAllBtn}
              onClick={onClose}
            >
              Xem tất cả
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default MobileMenu;
