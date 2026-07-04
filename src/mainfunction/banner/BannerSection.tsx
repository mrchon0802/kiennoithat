// app/(home)/banner/BannerSection.tsx
import Banner from "./Banner";
import { getData } from "@/lib/getData";
import { BannerItem } from "../../type/BannerType";

export default async function BannerSection() {
  const banners: BannerItem[] = await getData("/banners", 300);

  if (banners.length === 0) return null;

  return <Banner panels={banners} />;
}
