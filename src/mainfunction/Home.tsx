import CarouselContainer from "./CarouselContainer/CarouselContainer";
import Banner from "./banner/Banner";
import HouseDesign from "./housedesign/HouseDesign";
import Footer from "../components/footer/Footer";
import styles from "./home.module.css";

const apiUrl = process.env.SERVER_API_URL || "http://localhost:5000";

export default async function Home() {
  const [bannersRes, productsRes] = await Promise.all([
    fetch(`${apiUrl}/banners`, { cache: "no-store" }),
    fetch(`${apiUrl}/products`, { cache: "no-store" }),
  ]);

  const banners = await bannersRes.json();
  const products = await productsRes.json();

  return (
    <div className={styles.homePage}>
      <Banner panels={banners} />
      <CarouselContainer panels={products} />
      <HouseDesign />
      <Footer />
    </div>
  );
}
