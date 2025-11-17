import React from "react";
import Link from "next/link";
import "./footer.css";

function Footer() {
  return (
    <div className="footer">
      <div className="footer-link">
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
