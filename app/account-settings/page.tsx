import AccountSetting from "@/mainfunction/myaccount/accountsetting/AccountSetting";
import { redirect } from "next/navigation";

export default function AccountSettingPage() {
  redirect("/account-settings/personal-infomation");
}
