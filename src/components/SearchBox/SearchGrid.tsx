import Image from "next/image";
import Link from "next/link";
import styles from "./SearchGrid.module.css";

type Product = {
  productId: string;
  title: string;
  image: string;
  price: number;
};

export default function SearchGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p>Không tìm thấy sản phẩm nào</p>;
  }

  return (
    <div className={styles.grid}>
      {products.map((item) => (
        <Link
          key={item.productId}
          href={`/product/${item.productId}`}
          className={styles.card}
        >
          <div className={styles.imageWrap}>
            <Image
              src={item.image}
              alt={item.title}
              fill
              className={styles.image}
            />
          </div>
          <div className={styles.info}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.price}>{item.price.toLocaleString()} đ</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
