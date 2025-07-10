import { Link, useNavigate } from 'react-router';
import { Plus } from 'lucide-react';

import {
  useDeleteNoteMutation,
  useGetAllNotesQuery,
} from '@/api/cruds/notesAPI';

import DeleteConfirmation from '@/components/shared/DeleteConfirmation';
import { useDeleteModal } from '@/hooks/useDeleteConfirmation';
import NoteCard from '@/components/Cards/NoteCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import { useTypedSelector } from '@/api/store/store';
import { toast } from 'react-hot-toast';
import { Note } from '@/types/notes';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useTypedSelector((state) => state.auth);
  const { data, isLoading, error } = useGetAllNotesQuery(null);

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

  // Wrap the delete handler to check authentication
  const handleDeleteClick = (note: Note) => {
    if (!isAuthenticated) {
      toast.error('Please login to delete notes');
      navigate('/login');
      return;
    }
    originalHandleDeleteClick(note);
  };

  if (isLoading) return <LoadingIndicator />;
  if (error)
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <img
          src='/error-illustration.svg'
          alt='Error'
          className='w-40 h-40 mb-6 opacity-80'
        />
        <h2 className='text-2xl font-semibold text-red-600 mb-2'>
          Something went wrong
        </h2>
        <p className='text-gray-500 mb-4'>
          We couldn't load your notes. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className='inline-flex items-center bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300'
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          My Notes
        </h1>
        <Link
          to={isAuthenticated ? '/create' : '/login'}
          className='relative group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl overflow-hidden'
          onClick={(e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              toast.error('Please login to create notes');
              navigate('/login');
            }
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
          <Plus className='mr-2 h-5 w-5 relative z-10' />
          <span className='relative z-10'>Create Note</span>
        </Link>
      </div>
      {data?.data?.length === 0 && (
        <div className='flex flex-col items-center justify-center text-center py-20'>
          <img
            src='/empty-notes.svg'
            alt='No Notes'
            className='w-40 h-40 mb-6 opacity-80'
          />
          <h2 className='text-2xl font-semibold text-gray-700 mb-2'>
            No Notes Yet
          </h2>
          <p className='text-gray-500 mb-4'>
            You haven't created any notes. Click below to get started.
          </p>
          <Link
            to={isAuthenticated ? '/create' : '/login'}
            className='inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300'
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                toast.error('Please login to create notes');
                navigate('/login');
              }
            }}
          >
            <Plus className='w-4 h-4 mr-2' />
            Create Your First Note
          </Link>
        </div>
      )}

      {Array.isArray(data?.data) && data.data.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {data.data.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              handleDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      )}

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

export default HomePage;
