import NavBarDynamic from "./NavBarDynamic";
import dynamic from "next/dynamic";

const NavBarDynamic = dynamic(() => import("./NavBar"), { ssr: false });

export default function NavBarServer() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  return <NavBarDynamic baseUrl={baseUrl} />;
}
