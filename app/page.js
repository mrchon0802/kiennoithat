import Home from "../src/mainfunction/Home";
import fs from "fs";
import path from "path";

export default function IndexPage() {
  const filePath = path.join(process.cwd(), "public/data/product.json");
  const jsData = fs.readFileSync(filePath, "utf-8");
  const { productOption } = JSON.parse(jsData);
  return <Home productOption={productOption} />;
}
