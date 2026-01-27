import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { LoginState, AuthUser } from "@/type/Login";

/* ===================== INITIAL STATE ===================== */

const initialState: LoginState = {
  user: null,
  token: null,
  emailLogin: "",
  loading: false,
  error: null,
};

/* ===================== SLICE ===================== */

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    /** Start login */
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

    /** Login success */
    loginSuccess(
      state,
      action: PayloadAction<
        | AuthUser
        | {
            user: AuthUser;
            token?: string;
          }
      >,
    ) {
      state.loading = false;

      if ("user" in action.payload) {
        state.user = action.payload.user;
        state.token = action.payload.token ?? null;
      } else {
        state.user = action.payload;
      }

      state.error = null;
    },

    /** Login failure */
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    /** Logout */
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    },

    /** Save email for pre-login step */
    setEmailLogin(state, action: PayloadAction<string>) {
      state.emailLogin = action.payload;
    },
  },
});

/* ===================== EXPORT ===================== */

export const { loginStart, loginSuccess, loginFailure, logout, setEmailLogin } =
  loginSlice.actions;

export default loginSlice.reducer;
