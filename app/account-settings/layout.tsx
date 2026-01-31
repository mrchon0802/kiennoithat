import AccountSetting from "@/mainfunction/myaccount/accountsetting/AccountSetting";
import { ReactNode } from "react";

interface AccountSettingLayoutProps {
  children: ReactNode;
}

export default function AccountSettingLayout({
  children,
}: AccountSettingLayoutProps) {
  return <AccountSetting>{children}</AccountSetting>;
}
