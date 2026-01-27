// src/types/banner.ts

export interface BannerButton {
  label: string;
  link: string;
}

export interface BannerItem {
  title: string;
  description: string;
  image: string;
  buttons: BannerButton[];
}
