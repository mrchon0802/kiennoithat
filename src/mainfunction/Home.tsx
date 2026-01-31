import CarouselContainer from "./CarouselContainer/CarouselContainer";
import Banner from "./banner/Banner";
import HouseDesign from "./housedesign/HouseDesign";
import styles from "./home.module.css";
import ProductGrid from "./ProductGrid/ProductGrid";

const apiUrl = process.env.SERVER_API_URL || "http://localhost:5000";

// Hàm helper để fetch dữ liệu an toàn
async function getData(endpoint, revalidateTime = 0) {
  try {
    const res = await fetch(`${apiUrl}${endpoint}`, {
      // Sử dụng revalidate để cache (ISR). Nếu muốn luôn mới thì để 0.
      next: { revalidate: revalidateTime },
    });

    if (!res.ok) {
      console.error(`Failed to fetch ${endpoint}: ${res.status}`);
      return []; // Trả về mảng rỗng hoặc null để không crash trang
    }

    return res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return []; // Fallback an toàn
  }
}

export default async function Home() {
  if (!apiUrl) {
    console.error("API_URL is not defined");
  }

  // 1. TỐI ƯU HIỆU NĂNG: Chạy tất cả song song
  // 2. TỐI ƯU CACHE: Banners/Hero ít thay đổi -> cache 1 tiếng (3600s). Products -> cache 60s
  const [banners, productHero, products] = await Promise.all([
    getData("/banners", 3600),
    getData("/products/hero", 3600),
    getData("/products", 60),
  ]);

  return (
    <div className={styles.homePage}>
      {/* Chỉ render nếu có dữ liệu để tránh lỗi giao diện */}
      {banners.length > 0 && <Banner panels={banners} />}

      {productHero.length > 0 && <CarouselContainer panels={productHero} />}

      <ProductGrid products={products} />

      <HouseDesign />
    </div>
  );
}
