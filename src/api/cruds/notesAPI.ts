import { createApi } from '@reduxjs/toolkit/query/react';
import { Response } from 'src/types/common';
import customFetchBase from '@/api/middleware/customFetchBase';

export const NoteAPI = createApi({
  baseQuery: customFetchBase,
  reducerPath: 'notes',
  tagTypes: ['Note'],
  endpoints: (builder) => ({
    getAllNotes: builder.query<Response<any[]>, null>({
      query: () => ({
        url: `/notes/public`,
        method: 'GET',
        redirect: 'manual',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Note' as const, id })),
              { type: 'Note', id: 'LIST' },
            ]
          : [{ type: 'Note', id: 'LIST' }],
    }),

    getNotesForUsers: builder.query<Response<any[]>, null>({
      query: () => ({
        url: `/notes`,
        method: 'GET',
        redirect: 'manual',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Note' as const, id })),
              { type: 'Note', id: 'LIST' },
            ]
          : [{ type: 'Note', id: 'LIST' }],
    }),

    getNoteById: builder.query<Response<any>, { id: string }>({
      query: ({ id }) => ({
        url: `/notes/public/${id}`,
        method: 'GET',
        redirect: 'manual',
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'Note', id }],
    }),

    getNoteByIdForUser: builder.query<Response<any>, { id: string }>({
      query: ({ id }) => ({
        url: `/notes/${id}`,
        method: 'GET',
        redirect: 'manual',
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'Note', id }],
    }),

    addNote: builder.mutation<Response<any>, FormData>({
      query: (data) => ({
        url: '/notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Note', id: 'LIST' }],
    }),

    updateNote: builder.mutation<
      Response<any>,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Note', id },
        { type: 'Note', id: 'LIST' },
      ],
    }),

    deleteNote: builder.mutation<Response<any>, { id: string }>({
      query: (data) => ({
        url: `/notes/${data?.id}`,
        method: 'DELETE',
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Note', id },
        { type: 'Note', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllNotesQuery,
  useGetNotesForUsersQuery,
  useGetNoteByIdQuery,
  useGetNoteByIdForUserQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = NoteAPI;
