import type { Metadata } from "next";
import NavBar from "@/components/navbar/NavBar";
import { Providers } from "@/store/Providers";
import AuthInitializer from "@/components/loginform/AuthInitializer";
import { Analytics } from "@vercel/analytics/react";
import type { MenuProductItem, MenuDesignItem } from "@/type/Navbar";

import "../styles/globals.css";

/* ================= METADATA ================= */

export const metadata: Metadata = {
  title: "Kiennoithat.com",
  description: "Website nội thất",
};

/* ================= SERVER FETCH ================= */

async function getNavData(): Promise<{
  productItems: MenuProductItem[];
  designItems: MenuDesignItem[];
}> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  const [productRes, designRes] = await Promise.all([
    fetch(`${baseUrl}/product-nav-items`, {
      next: { revalidate: 3600 },
    }),
    fetch(`${baseUrl}/design-nav-items`, {
      next: { revalidate: 3600 },
    }),
  ]);

  if (!productRes.ok || !designRes.ok) {
    throw new Error("Failed to fetch navbar data");
  }

  return {
    productItems: await productRes.json(),
    designItems: await designRes.json(),
  };
}

/* ================= LAYOUT ================= */

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { productItems, designItems } = await getNavData();

  return (
    <html lang="vi">
      <body>
        <Providers>
          <AuthInitializer />
          <NavBar productItems={productItems} designItems={designItems} />
          <main>{children}</main>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
