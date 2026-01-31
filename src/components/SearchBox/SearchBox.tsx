"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./SearchBox.module.css";

type Product = {
  productId: string;
  title: string;
  image: string;
  price: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SearchBox() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `${API_URL}/products/search?q=${encodeURIComponent(keyword)}`,
        );

        if (!res.ok) return;

        const data: Product[] = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [keyword]);

  // 🔥 click ngoài → đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keyword.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div ref={wrapperRef} className={styles.searchWrapper}>
      <input
        type="text"
        placeholder="Tìm kiếm trên Kiến nội thất"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        className={styles.searchInput}
      />

      {open && results.length > 0 && (
        <div
          className={styles.dropdown}
          onMouseDown={(e) => e.preventDefault()}
        >
          {results.map((item) => (
            <Link
              key={item.productId}
              href={`/product/${item.productId}`}
              className={styles.item}
            >
              <Image src={item.image} alt={item.title} width={40} height={40} />
              <div className={styles.info}>
                <p className={styles.title}>{item.title}</p>
                <span className={styles.price}>
                  {item.price.toLocaleString()} đ
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
