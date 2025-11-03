import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userApi } from "@/api/userApi";

//async thunks
export const fetchUsers = createAsyncThunk("user/fetchhAll", async () => {
  const res = await userApi.getAll();
  return res.data;
});

export const createUser = createAsyncThunk("user/create", async (userData) => {
  const res = await userApi.create(userData);
  return res.data;
});

export const updateUser = createAsyncThunk("user/update", async (userData) => {
  const res = await userApi.update(userData.id, userData);
  return res.data;
});

export const deleteUser = createAsyncThunk("user/delete", async (id) => {
  await userApi.remove(id);
  return id;
});

//Initial State
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

//slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //quan li register wizard
    updateRegisterForm: (state, action) => {
      state.registerForm = { ...state.registerForm, ...action.payload };
    },
    clearRegisterForm: (state) => {
      state.registerForm = { ...initialState.registerForm };
    },
    setEmailLogin: (state, action) => {
      state.emailLogin = action.payload;
    },
    //clear user
    clearUser: (state) => {
      state.users = [];
    },
    //xu li API tu backend
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export const {
  clearUser,
  updateRegisterForm,
  clearRegisterForm,
  setEmailLogin,
} = userSlice.actions;

export default userSlice.reducer;
