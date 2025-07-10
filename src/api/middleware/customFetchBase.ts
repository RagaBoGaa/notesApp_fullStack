import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import Cookies from 'js-cookie';

const mutex = new Mutex();

const getToken = () => {
  const token = Cookies.get('token');
  return token;
};

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://notes-backend-rouge.vercel.app/api',
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const customFetchBase: BaseQueryFn<
  string | FetchArgs,
  any,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    } else {
      const release = await mutex.acquire();
      try {
        const refreshResult = await refresh(api, extraOptions);
        const data: any = refreshResult?.data;

        if (data?.token) {
          Cookies.set('user', JSON.stringify({ access_token: data.token }));
          result = await baseQuery(args, api, extraOptions);
        }
      } finally {
        release();
      }
    }
  }

  return result;
};

const refresh = (api: any, extraOptions: any) => {
  return baseQuery(
    {
      url: `https://eightbackend.amyalsmart.com/auth/refresh`,
      method: 'POST',
    },
    api,
    extraOptions
  );
};

export default customFetchBase;
