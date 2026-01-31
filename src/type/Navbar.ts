export interface MenuProductItem {
  _id: string;
  title: string;
  slug: string;
  image: string;
  link: string;
}

export interface MenuDesignItem {
  _id: string;
  title: string;
  slug: string;
  image: string;
  link: string;
}

export interface NavBarProps {
  productItems: MenuProductItem[];
  designItems: MenuDesignItem[];
}
