"use client";

import React from "react";
import { Facebook, Youtube, MapPin, Instagram } from "lucide-react";

import styles from "./Contact.module.css";

type SocialLink = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    href: "https://facebook.com/kiennoithat",
    icon: <Facebook className={styles.icon} />,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/kiennoithat",
    icon: <Instagram className={styles.icon} />,
  },
  {
    name: "Tiktok",
    href: "https://tiktok.com/kiennoithat",
    icon: <Youtube className={styles.icon} />,
  },
];

export default function Contact() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Liên Hệ</h1>

      {/* Showroom */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <MapPin className={styles.pinIcon} />
          Địa chỉ Showroom
        </h2>

        <p className={styles.text}>
          123 Đường Nguyễn Du, Phường Thuận An, TP. Hồ Chí Minh
          <br />
          (Mở cửa: 8h00 - 21h00 hàng ngày)
        </p>
      </div>

      {/* Social */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Kết nối với chúng tôi</h2>

        <div className={styles.socialWrapper}>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              {social.icon}
              <span className={styles.socialText}>{social.href}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
