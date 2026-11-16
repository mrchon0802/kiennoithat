"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { refreshSession } from "@/api/axiosInstance";
import { authInitialized, loginSuccess, logout } from "@/store/loginSlice";
import type { AppDispatch } from "@/store/store";

const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let active = true;
    const restoreSession = async (): Promise<void> => {
      try {
        const res = await refreshSession();
        if (active && res.data?.user) dispatch(loginSuccess(res.data.user));
        else if (active) dispatch(logout());
      } catch (error) {
        // A 401 confirms an absent/expired refresh cookie. Do not clear a
        // potentially valid session on transient network, CORS or server errors.
        if (active && axios.isAxiosError(error) && error.response?.status === 401) {
          dispatch(logout());
        }
      } finally {
        if (active) dispatch(authInitialized());
      }
    };
    void restoreSession();
    return () => { active = false; };
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
