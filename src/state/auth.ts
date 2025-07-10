import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { LoginResponse } from '@/api/cruds/auth/login';

export interface AuthState {
  user: {
    id?: string;
    name?: string;
    email?: string;
    type?: string;
  } | null;
  isAuthenticated: boolean;
  token: string | null;
}

const getInitialState = (): AuthState => {
  const token = Cookies.get('token') || null;
  const userStr = localStorage.getItem('user');
  let user = null;

  try {
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
  }

  return {
    user,
    isAuthenticated: !!token,
    token,
  };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { data } = action.payload;

      state.user = {
        id: data._id,
        name: data.name,
        email: data.email,
      };
      state.token = data?.token;
      state.isAuthenticated = true;

      Cookies.set('token', data?.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email,
          isAuthenticated: true,
        })
      );
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      Cookies.remove('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
