"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { userApi } from "@/api/userApi";
import { loginSuccess, logout } from "@/store/loginSlice";
import type { AppDispatch } from "@/store/store";

// --------------------
// Component
// --------------------
const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const restoreSession = async (): Promise<void> => {
      try {
        // Gọi API refresh token khi load lại trang
        const res = await userApi.refresh();

        if (res.data?.user) {
          dispatch(loginSuccess(res.data.user));
          console.log("🔁 Phiên đăng nhập đã được khôi phục");
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Không thể khôi phục phiên đăng nhập";

        console.warn("⚠️", message);
        dispatch(logout());
      }
    };

    restoreSession();
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
