import { createApi } from '@reduxjs/toolkit/query/react';
import { Response } from 'src/types/common';
import customFetchBase from '@/api/middleware/customFetchBase';
import { LoginForm, LoginResponse, RegisterForm } from './login';
import { Profile } from './profile';

export const AuthAPI = createApi({
  baseQuery: customFetchBase,
  reducerPath: 'authApi',
  tagTypes: ['auth'],
  endpoints: (builder) => ({
    register: builder.mutation<LoginResponse, RegisterForm>({
      invalidatesTags: ['auth'],
      query: (request) => ({
        url: `/users`,
        body: request,
        method: 'POST',
        redirect: 'manual',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    }),
    login: builder.mutation<LoginResponse, LoginForm>({
      invalidatesTags: ['auth'],
      query: (request) => ({
        url: `/users/login`,
        body: request,
        method: 'POST',
        redirect: 'manual',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    }),
    getProfile: builder.query<Response<Profile>, null>({
      query: () => ({
        url: `/users/profile`,
        method: 'GET',
        redirect: 'manual',
      }),
    }),

    updateProfile: builder.mutation<Response<any>, { data: any }>({
      query: ({ data }) => ({
        url: `/users/profile`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'auth', id: 'LIST' }],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = AuthAPI;
