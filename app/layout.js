import NavBar from "@/components/navbar/NavBar";
import { Providers } from "@/store/Providers";
import "../styles/globals.css";
import fs from "fs";
import path from "path";

export const metadata = {
  title: "Kiennoithat.com",
  description: "Website nội thất",
};

export default function RootLayout({ children }) {
  const filePath = path.join(process.cwd(), "public/data/product.json");
  const jsData = fs.readFileSync(filePath, "utf-8");
  const { productOption } = JSON.parse(jsData);
  return (
    <html lang="vi">
      <body>
        <Providers>
          <NavBar productOption={productOption} />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
