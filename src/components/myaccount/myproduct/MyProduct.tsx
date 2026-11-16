"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import styles from "./MyProduct.module.css";
import PurchasedProductCard from "./PurchasedProductCard";
import type { RootState } from "@/store/store";

const MyProduct: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.login.user);
  const currentUserId = currentUser?._id;
  const products = useSelector((state: RootState) => state.products.products);

  const myProducts = useMemo(() => {
    if (!currentUserId) return [];
    return products.filter((product) => product.userId === currentUserId);
  }, [products, currentUserId]);

  return (
    <main className={styles.mainContent}>
      <div className={styles.pageHeading}>
        <div>
          <h2>Sản Phẩm Của Tôi</h2>
          <p className={styles.pageDescription}>
            Quản lý sản phẩm đã mua và theo dõi thời hạn bảo hành.
          </p>
        </div>
        {myProducts.length > 0 && (
          <span className={styles.productCount}>
            {myProducts.length} sản phẩm
          </span>
        )}
      </div>

      {myProducts.length > 0 ? (
        <div className={styles.productsGrid}>
          {myProducts.map((product) => (
            <PurchasedProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <section className={styles.emptyState}>
          <div className={styles.emptyIllustration}>
            <div className={styles.emptyCircle}>
              <ShoppingBag size={42} strokeWidth={1.4} />
            </div>
            <span className={styles.shieldIcon}>
              <ShieldCheck size={23} strokeWidth={1.7} />
            </span>
          </div>

          <span className={styles.emptyEyebrow}>KHU VỰC BẢO HÀNH</span>
          <h3>Bạn chưa có sản phẩm nào</h3>
          <p className={styles.emptyDescription}>
            Những sản phẩm bạn đã mua sẽ được hiển thị tại đây. Bạn có thể xem
            thông tin sản phẩm, thời hạn bảo hành và gửi yêu cầu hỗ trợ khi cần.
          </p>

          <div className={styles.emptyHint}>
            <ShieldCheck size={18} />
            <span>Thông tin bảo hành sẽ được lưu lại để bạn dễ dàng tra cứu.</span>
          </div>

          <div className={styles.emptyActions}>
            <Link href="/" className={styles.shopButton}>
              Khám phá sản phẩm <ArrowRight size={16} />
            </Link>
            <Link href="/my-account/order-history" className={styles.historyLink}>
              Xem lịch sử đặt hàng
            </Link>
          </div>
        </section>
      )}
    </main>
  );
};

export default MyProduct;
