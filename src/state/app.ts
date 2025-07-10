import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Locale } from '@/types/common';
import Cookies from 'js-cookie';

export interface AppState {
  isLoading: boolean;
  alert: {
    severity: 'error' | 'info' | 'success';
    content: string;
    isOpen: boolean;
  };
  language: Locale;
}

const initialState: AppState = {
  isLoading: false,
  alert: {
    severity: 'error',
    content: '',
    isOpen: false,
  },
  language: (Cookies.get('lang') as Locale) ?? 'ar',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAlert: (
      state,
      action: PayloadAction<{
        severity: 'error' | 'info' | 'success';
        content: string;
        isOpen: boolean;
      }>
    ) => {
      state.alert = action.payload;
    },
  },
});

export const { setIsLoading, setAlert } = appSlice.actions;

export default appSlice.reducer;
