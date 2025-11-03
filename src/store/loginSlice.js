import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // thông tin user từ MongoDB
  token: null, // JWT token từ backend
  emailLogin: "", // lưu email ở bước đầu (nếu có bước chọn email riêng)
  loading: false, // trạng thái đang xử lý login
  error: null, // thông báo lỗi (nếu có)
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    // Khi bắt đầu login
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Khi login thành công
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user || action.payload;
      state.error = null;
    },

    // Khi login thất bại
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Đăng xuất
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("auth");
    },

    // Dùng để lưu email khi người dùng nhập ở bước trước
    setEmailLogin: (state, action) => {
      state.emailLogin = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setEmailLogin } =
  loginSlice.actions;

export default loginSlice.reducer;
