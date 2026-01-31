import MyAccount from "@/mainfunction/myaccount/MyAccount";
import { ReactNode } from "react";

interface MyAccountPageProps {
  children: ReactNode;
}

export default function MyAccountPage({ children }: MyAccountPageProps) {
  return <MyAccount>{children}</MyAccount>;
}
