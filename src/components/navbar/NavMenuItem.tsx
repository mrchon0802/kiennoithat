// components/NavBar/NavMenuItem.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./NavMenuItem.module.css";
import {
  fetchAllProducts,
  getHeroProductsByRoom,
  formatPrice,
  Product,
} from "./productsCache";

interface NavMenuItemProps {
  label: string;
  slug: string;
  room: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  sofa: "Sofa & ghế",
  chair: "Ghế",
  table: "Bàn",
  bed: "Giường",
  cabinet: "Tủ",
  other: "Khác",
};

const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonImg} />
    <div className={styles.skeletonInfo}>
      <div className={styles.skeletonLine} style={{ width: "70%" }} />
      <div className={styles.skeletonLine} style={{ width: "45%" }} />
    </div>
  </div>
);

const NavMenuItem: React.FC<NavMenuItemProps> = ({ label, slug, room }) => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [allCats, setAllCats] = useState<string[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadProducts = useCallback(async () => {
    if (fetched) return;
    setLoading(true);
    try {
      const all = await fetchAllProducts();
      const byRoom = all.filter((p) => p.room.includes(room));
      const cats = [...new Set(byRoom.map((p) => p.category))];

      setAllCats(cats);
      setProducts(getHeroProductsByRoom(all, room));
      setFetched(true);
    } catch (err) {
      console.error("[NavMenuItem] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [room, fetched]);

  const filterByCat = useCallback(
    async (cat: string | null) => {
      setActiveCat(cat);
      const all = await fetchAllProducts();
      const byRoom = all.filter((p) => p.room.includes(room));

      if (cat === null) {
        setProducts(getHeroProductsByRoom(all, room));
      } else {
        setProducts(byRoom.filter((p) => p.category === cat).slice(0, 4));
      }
    },
    [room],
  );

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
    loadProducts();
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`${styles.navItem} ${open ? styles.active : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={styles.navLink}>{label}</button>

      <div className={`${styles.megaMenu} ${open ? styles.megaMenuOpen : ""}`}>
        <div className={styles.megaTop}>
          <span className={styles.megaTitle}>Sản phẩm nổi bật</span>
          <Link href={`/san-pham?room=${room}`} className={styles.megaViewAll}>
            Xem tất cả {label}
          </Link>
        </div>

        <div className={styles.heroGrid}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : products.length > 0 ? (
            products.map((p) => (
              <Link
                key={p.productId}
                href={`/san-pham/${p.productId}`}
                className={styles.heroCard}
              >
                <div className={styles.heroImg}>
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="150px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.heroInfo}>
                  <div className={styles.heroName}>{p.title}</div>
                  <div className={styles.heroPrice}>{formatPrice(p.price)}</div>
                  <div className={styles.heroActions}>
                    <span className={styles.btnLearn}>Xem</span>
                    <span className={styles.btnOrder}>Đặt hàng</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className={styles.emptyNote}>Chưa có sản phẩm.</p>
          )}
        </div>

        {allCats.length > 0 && (
          <>
            <div className={styles.divider} />
            <div className={styles.categoryLabel}>Xem theo danh mục</div>
            <div className={styles.pills}>
              <button
                className={`${styles.pill} ${activeCat === null ? styles.pillActive : ""}`}
                onClick={() => filterByCat(null)}
              >
                Tất cả
              </button>
              {allCats.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.pill} ${activeCat === cat ? styles.pillActive : ""}`}
                  onClick={() => filterByCat(cat)}
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                </button>
              ))}
              <Link
                href={`/san-pham?room=${room}`}
                className={`${styles.pill} ${styles.pillLink}`}
              >
                Xem tất cả
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavMenuItem;
