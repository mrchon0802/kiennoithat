export type UserRole = "user" | "admin";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt?: string;
}

export interface RegisterForm {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  role: UserRole | "";
}

export interface UserState {
  users: User[];
  registerForm: RegisterForm;
  emailLogin: string;
}
