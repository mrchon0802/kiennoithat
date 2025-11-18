import NavBar from "@/components/navbar/NavBar";
import { Providers } from "@/store/Providers";
import "../styles/globals.css";
import AuthInitializer from "@/components/loginform/AuthInitializer";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Kiennoithat.com",
  description: "Website nội thất",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <AuthInitializer />
          <NavBar />
          <main>{children}</main>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
