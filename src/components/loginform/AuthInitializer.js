"use client";

import { useEffect } from "react";
import { userApi } from "@/api/userApi";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "@/store/loginSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Gọi API refresh token khi load lại trang
        const res = await userApi.refresh();
        console.log("🔁 refresh response:", res.data);

        if (res.data?.user) {
          dispatch(loginSuccess(res.data.user || res.data));
          console.log("🔁 Phiên đăng nhập đã được khôi phục");
        }
      } catch (err) {
        console.warn("⚠️ Không thể khôi phục phiên đăng nhập:", err.message);
        dispatch(logout());
      }
    };

    restoreSession();
  }, [dispatch]);

  return null; // Không render gì ra UI
}
