import CarouselContainer from "./CarouselContainer/CarouselContainer";
import Banner from "./banner/Banner";
import styles from "./home.module.css";
import ProductGrid from "./ProductGrid/ProductGrid";

const apiUrl = process.env.SERVER_API_URL || "http://localhost:5000";

// Hàm helper để fetch dữ liệu an toàn, có retry + timeout
async function getData(endpoint, revalidateTime = 0, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        // Sử dụng revalidate để cache (ISR). Nếu muốn luôn mới thì để 0.
        next: { revalidate: revalidateTime },
        // Tránh treo quá lâu nếu backend cold start (Railway free tier...)
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        console.error(`Failed to fetch ${endpoint}: ${res.status}`);
        // Lỗi HTTP (4xx/5xx) thường không tự khỏi nếu retry ngay -> trả về luôn
        return [];
      }

      return res.json();
    } catch (error) {
      const isLastAttempt = attempt === retries;
      console.error(
        `Error fetching ${endpoint} (attempt ${attempt + 1}/${retries + 1}):`,
        error,
      );

      if (isLastAttempt) {
        return []; // Fallback an toàn sau khi đã thử hết số lần retry
      }

      // Backoff ngắn trước khi thử lại, hữu ích khi backend đang cold start
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }

  return [];
}

export default async function Home() {
  if (!apiUrl) {
    console.error("API_URL is not defined");
  }

  // 1. TỐI ƯU HIỆU NĂNG: Chạy tất cả song song
  // 2. TỐI ƯU CACHE:
  //    - Banners/Hero: cache 300s (5 phút) thay vì 3600s, để lỗi tạm thời
  //      (cold start, mạng chập chờn) không bị "đóng băng" cả tiếng.
  //    - Products: cache 60s, dữ liệu thay đổi thường xuyên hơn.
  const [banners, productHero, products] = await Promise.all([
    getData("/banners", 300),
    getData("/products/hero", 300),
    getData("/products", 60),
  ]);

  return (
    <div className={styles.homePage}>
      {/* Chỉ render nếu có dữ liệu để tránh lỗi giao diện */}
      {banners.length > 0 && <Banner panels={banners} />}

      {productHero.length > 0 && <CarouselContainer panels={productHero} />}

      <ProductGrid products={products} />
    </div>
  );
}
