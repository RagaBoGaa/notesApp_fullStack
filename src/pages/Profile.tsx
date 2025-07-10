import { Link, useNavigate } from 'react-router';
import { useGetProfileQuery } from '@/api/cruds/auth/auth';
import {
  useGetNotesForUsersQuery,
  useDeleteNoteMutation,
} from '@/api/cruds/notesAPI';
import { useDispatch } from 'react-redux';
import { logout } from '@/state/auth';
import { toast } from 'react-hot-toast';
import NoteCard from '@/components/Cards/NoteCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import DeleteConfirmation from '@/components/shared/DeleteConfirmation';
import { useDeleteModal } from '@/hooks/useDeleteConfirmation';
import { Plus, LogOut, User } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: profileData, isLoading: profileLoading } =
    useGetProfileQuery(null);
  const { data: notesData, isLoading: notesLoading } =
    useGetNotesForUsersQuery(null);

  const {
    showDeleteModal,
    entityToDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleDeleteClick,
    isDeleting,
  } = useDeleteModal({
    deleteMutation: useDeleteNoteMutation,
    entityName: 'Note',
  });

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (profileLoading || notesLoading) return <LoadingIndicator />;

  return (
    <div className='max-w-7xl mx-auto p-4'>
      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center'>
            <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 mr-4'>
              <User className='h-8 w-8 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>
                {profileData?.data?.name || 'User'}
              </h1>
              <p className='text-gray-500'>{profileData?.data?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors'
          >
            <LogOut className='h-4 w-4 mr-2' />
            Logout
          </button>
        </div>
      </div>

      <div className='mb-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            My Notes
          </h2>
          <Link
            to='/create'
            className='relative group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl overflow-hidden'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
            <Plus className='mr-2 h-5 w-5 relative z-10' />
            <span className='relative z-10'>Create Note</span>
          </Link>
        </div>

        {notesData?.data?.length === 0 && (
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
              to='/create'
              className='inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300'
            >
              <Plus className='w-4 h-4 mr-2' />
              Create Your First Note
            </Link>
          </div>
        )}

        {Array.isArray(notesData?.data) && notesData.data.length > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            {notesData.data.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                handleDeleteClick={handleDeleteClick}
                isUserNote={true}
              />
            ))}
          </div>
        )}
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

export default Profile;
