import {
  useDeleteNoteMutation,
  useGetNoteByIdQuery,
} from '@/api/cruds/notesAPI';
import LoadingIndicator from '@/components/LoadingIndicator';
import DeleteConfirmation from '@/components/shared/DeleteConfirmation';
import { useDeleteModal } from '@/hooks/useDeleteConfirmation';
import { formatDate } from '@/utilities/formatDate';
import { ArrowLeft, Calendar, Clock, Edit, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useParams, Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import ErrorComponent from '@/components/shared/ErrorComponent';
import { useTypedSelector } from '@/api/store/store';
import { Note } from '@/types/notes';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useTypedSelector((state) => state.auth);

  const { data, isLoading, isError, error, refetch } = useGetNoteByIdQuery(
    { id: `${id}` },
    { skip: !id }
  );

  const {
    showDeleteModal,
    entityToDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleDeleteClick: originalHandleDeleteClick,
    isDeleting,
  } = useDeleteModal({
    deleteMutation: useDeleteNoteMutation,
    entityName: 'Note',
  });

  const handleDeleteClick = (note: Note) => {
    if (!isAuthenticated) {
      toast.error('Please login to delete notes');
      navigate('/login');
      return;
    }
    originalHandleDeleteClick(note);
  };

  const handleEditClick = (noteId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to edit notes');
      navigate('/login');
      return;
    }
    navigate(`/edit/${noteId}`);
  };

  useEffect(() => {
    if (isError && error) {
      let errorType: 'fetch' | 'not-found' | 'network' | 'generic' = 'generic';

      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        (error as { status?: number }).status === 400
      ) {
        errorType = 'not-found';
      }

      if (errorType) {
        const errorMessage =
          (error &&
            'data' in error &&
            (error as { data?: { message?: string } }).data?.message) ||
          'Failed to load note';
        toast.error(errorMessage);
      }
    }
  }, [isError, error]);

  if (!id) {
    return (
      <ErrorComponent
        error={{ message: 'No note ID provided' }}
        type='not-found'
      />
    );
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    let errorType: 'fetch' | 'not-found' | 'network' | 'generic' = 'generic';

    if (
      error &&
      typeof error === 'object' &&
      'status' in error &&
      (error as { status?: number }).status === 400
    ) {
      errorType = 'not-found';
    }

    return (
      <ErrorComponent
        error={error}
        onRetry={() => refetch()}
        type={errorType}
      />
    );
  }

  if (!data || !data.data) {
    return (
      <ErrorComponent
        error={{ message: 'Note data is not available' }}
        onRetry={() => refetch()}
        type='not-found'
      />
    );
  }

  const note = data.data;

  if (!note) {
    return (
      <ErrorComponent error={{ message: 'Note not found' }} type='not-found' />
    );
  }

  return (
    <div>
      <div className='container mx-auto max-w-4xl'>
        <Link
          to='/'
          className='group inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 mb-6 bg-white rounded-full px-4 py-2 shadow-md hover:shadow-lg'
        >
          <ArrowLeft className='h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300' />
          Back to Notes
        </Link>

        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
          <div className='h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'></div>

          <div className='p-8'>
            <div className='flex justify-between items-start mb-6'>
              <h1 className='text-4xl font-bold text-gray-800 leading-tight flex-grow mr-4'>
                {note.title || 'Untitled Note'}
              </h1>

              {isAuthenticated && note?.user?._id === user?.id && (
                <div className='flex gap-3'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(note._id);
                    }}
                    className='group/btn relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 hover:border-blue-300 shadow-md hover:shadow-lg overflow-hidden'
                  >
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300'></div>
                    <Edit className='h-5 w-5 text-blue-600 group-hover/btn:text-white transition-colors duration-300 relative z-10' />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(note);
                    }}
                    className='group/btn relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200 hover:border-red-300 shadow-md hover:shadow-lg overflow-hidden'
                  >
                    <div className='absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300'></div>
                    <Trash2 className='h-5 w-5 text-red-600 group-hover/btn:text-white transition-colors duration-300 relative z-10' />
                  </button>
                </div>
              )}
            </div>

            <div className='flex flex-wrap gap-6 mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200'>
              <div className='flex items-center text-gray-700'>
                <Calendar className='h-5 w-5 mr-3 text-green-500' />
                <div>
                  <p className='font-semibold text-sm'>Created</p>
                  <p className='text-sm'>
                    {note.createdAt ? formatDate(note.createdAt) : 'Unknown'}
                  </p>
                </div>
              </div>

              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <div className='flex items-center text-gray-700'>
                  <Clock className='h-5 w-5 mr-3 text-orange-500' />
                  <div>
                    <p className='font-semibold text-sm'>Last Updated</p>
                    <p className='text-sm'>{formatDate(note.updatedAt)}</p>
                  </div>
                </div>
              )}

              <div className='flex items-center bg-gradient-to-r w-fit from-indigo-50 to-purple-50 px-4 py-1 rounded-full border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 shadow-sm hover:shadow-md'>
                <div className='relative flex items-center justify-center w-8 h-8 mr-3 bg-gradient-to-br from-indigo-400 via-purple-500 to-indigo-600 rounded-full shadow-lg'>
                  <User className='h-4 w-4 text-white drop-shadow-sm' />
                  <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full'></div>
                </div>
                <div>
                  <p className='font-semibold text-xs text-indigo-700 uppercase tracking-wide'>
                    Created by
                  </p>
                  <p className='font-bold text-sm text-indigo-800 tracking-tighter'>
                    {note.user.name}
                  </p>
                </div>
              </div>
            </div>

            <div className='prose prose-lg max-w-none'>
              <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                Content
              </h3>
              <div className='bg-gray-50 rounded-xl p-6 border border-gray-200'>
                <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
                  {note.content || 'No content available'}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-6 border-t border-gray-200'>
            <div className='flex justify-between items-center flex-wrap gap-2'>
              <p className='text-sm text-gray-500'>
                Note ID: <span className='font-mono'>{note._id}</span>
              </p>
              <div className='flex gap-2'>
                <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium'>
                  {(note.content || '').length} characters
                </span>
                <span className='px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium'>
                  {(note.content || '').split(' ').length} words
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmation
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
          itemToDelete={entityToDelete?.title as string}
        />
      )}
    </div>
  );
};

export default NoteDetails;
