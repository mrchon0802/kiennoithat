import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentId: null, //id của user đang login
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentId = action.payload;
    },
    logout: (state) => {
      state.currentId = null;
    },
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
