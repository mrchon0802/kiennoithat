import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.footerLink}>
        <Link href="/">Kiến nội thất © 2025</Link>
        <Link href="/">Privacy and Legal</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/">Location</Link>
        <Link href="/">About us</Link>
      </div>
    </div>
  );
}
export default Footer;
