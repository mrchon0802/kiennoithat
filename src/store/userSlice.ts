import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userApi } from "@/api/userApi";
import type { User, UserState, RegisterForm } from "@/type/User";
import { CreateUserPayload } from "@/api/userApi";
import { UpdateUserPayload } from "@/api/userApi";

/** Fetch all users */
export const fetchUsers = createAsyncThunk<User[]>(
  "user/fetchAll",
  async () => {
    const res = await userApi.getAll();
    return res.data;
  },
);

/** Create user */
export const createUser = createAsyncThunk<User, CreateUserPayload>(
  "user/create",
  async (userData) => {
    const res = await userApi.create(userData);
    return res.data;
  },
);

/** Update user */
export const updateUser = createAsyncThunk<
  User,
  { id: string; data: UpdateUserPayload }
>("user/update", async ({ id, data }) => {
  const res = await userApi.update(id, data);
  return res.data;
});

/** Delete user */
export const deleteUser = createAsyncThunk<string, string>(
  "user/delete",
  async (id) => {
    await userApi.remove(id);
    return id;
  },
);

/* ===================== INITIAL STATE ===================== */

const initialState: UserState = {
  users: [],
  registerForm: {
    _id: "",
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

/* ===================== SLICE ===================== */

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /** Register wizard */
    updateRegisterForm: (
      state,
      action: PayloadAction<Partial<RegisterForm>>,
    ) => {
      state.registerForm = {
        ...state.registerForm,
        ...action.payload,
      };
    },

    clearRegisterForm: (state) => {
      state.registerForm = initialState.registerForm;
    },

    setEmailLogin: (state, action: PayloadAction<string>) => {
      state.emailLogin = action.payload;
    },

    clearUser: (state) => {
      state.users = [];
    },
  },

  extraReducers: (builder) => {
    builder
      /** Fetch users */
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
      })

      /** Create user */
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.push(action.payload);
      })

      /** Update user */
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      /** Delete user */
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

/* ===================== EXPORT ===================== */

export const {
  clearUser,
  updateRegisterForm,
  clearRegisterForm,
  setEmailLogin,
} = userSlice.actions;

export default userSlice.reducer;
