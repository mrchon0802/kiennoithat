import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  users: [],
  registerForm: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "",
  },
  emailLogin: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //quan li register wizard
    updateRegisterForm: (state, action) => {
      state.registerForm = { ...state.registerForm, ...action.payload };
    },
    clearRegisterForm: (state) => {
      state.registerForm = initialState.registerForm;
    },

    //quan li user
    addUser: (state, action) => {
      const newUser = { id: uuidv4(), ...action.payload };
      state.users.push(newUser);
    },
    updateUser: (state, action) => {
      const { id, ...change } = action.payload;
      const index = state.users.findIndex((u) => u.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...change };
      }
    },
    removeUser: (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    clearUser: (state) => {
      state.users = [];
    },
    setEmailLogin: (state, action) => {
      state.emailLogin = action.payload;
    },
  },
});

export const {
  addUser,
  updateUser,
  removeUser,
  clearUser,
  updateRegisterForm,
  clearRegisterForm,
  setEmailLogin,
} = userSlice.actions;

export default userSlice.reducer;
