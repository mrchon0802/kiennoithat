export interface AuthUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  fullAddress?: string;
  phoneNumber?: string;
  backupPhoneNumber?: string;
  password?: string;
}

export interface LoginState {
  user: AuthUser | null;
  token: string | null;
  emailLogin: string;
  loading: boolean;
  error: string | null;
}
