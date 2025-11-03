import CarouselContainer from "./CarouselContainer/CarouselContainer";
import styles from "./home.module.css";
import HomepageHeroSlide from "./HomepageHeroSlide/HomepageHeroSlide";
import HouseDesign from "./housedesign/HouseDesign";
import Footer from "../components/footer/Footer";

export default function Home() {
  return (
    <div className={styles.homePage}>
      <HomepageHeroSlide />
      <CarouselContainer />
      <HouseDesign />
      <Footer />
    </div>
  );
}
