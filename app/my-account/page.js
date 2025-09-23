import MyAccount from "@/mainfunction/myaccount/MyAccount";
import { redirect } from "next/navigation";

export default function MyAccountPage() {
  redirect("/my-account/my-product");
}
