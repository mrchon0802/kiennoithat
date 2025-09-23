import axios from "axios";
import CarouselContainer from "./CarouselContainer/CarouselContainer";
import styles from "./home.module.css";
import HomepageHeroSlide from "./HomepageHeroSlide/HomepageHeroSlide";
import HouseDesign from "./housedesign/HouseDesign";
import Footer from "../components/footer/Footer";

export default async function Home({ productOption }) {
  return (
    <div className={styles.homePage}>
      <HomepageHeroSlide productOption={productOption} />
      <CarouselContainer productOption={productOption} />
      <HouseDesign productOption={productOption} />
      <Footer />
    </div>
  );
}
