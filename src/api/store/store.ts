import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import AppReducer from '@/state/app';
import AuthReducer from '@/state/auth';
import { NoteAPI } from '../cruds/notesAPI';
import { AuthAPI } from '../cruds/auth/auth';

const reducers = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  [NoteAPI.reducerPath]: NoteAPI.reducer,
  [AuthAPI.reducerPath]: AuthAPI.reducer,
});

const Store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(NoteAPI.middleware, AuthAPI.middleware),
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export default Store;
