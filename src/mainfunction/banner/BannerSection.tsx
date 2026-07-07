// app/(home)/banner/BannerSection.tsx
import Banner from "./Banner";
import { getData } from "@/lib/getData";
import { BannerItem } from "../../type/BannerType";
import BannerSkeleton from "./BannerSkeleton";

export default async function BannerSection() {
  const banners: BannerItem[] = await getData("/banners", 300);
  // const banners: BannerItem[] = [];

  if (banners.length === 0) return <BannerSkeleton />; // giữ skeleton thay vì null

  return <Banner panels={banners} />;
}
