import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Plus, LogOut, User, Sparkles, BookOpen, Calendar } from 'lucide-react';

import { useGetProfileQuery } from '@/api/cruds/auth/auth';
import {
  useGetNotesForUsersQuery,
  useDeleteNoteMutation,
  NoteAPI,
} from '@/api/cruds/notesAPI';
import { AuthAPI } from '@/api/cruds/auth/auth';
import { logout } from '@/state/auth';

import NoteCard from '@/components/Cards/NoteCard';
import LoadingIndicator from '@/components/LoadingIndicator';
import DeleteConfirmation from '@/components/shared/DeleteConfirmation';
import { useDeleteModal } from '@/hooks/useDeleteConfirmation';
import { getTimeAgo } from '@/utilities/formatDate';

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
    dispatch(AuthAPI.util.resetApiState());
    dispatch(NoteAPI.util.resetApiState());
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (profileLoading || notesLoading) return <LoadingIndicator />;

  const notesCount = notesData?.data?.length || 0;

  return (
    <div>
      {/* Animated Background Elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000'></div>
        <div className='absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000'></div>
      </div>

      <div className='relative max-w-7xl mx-auto p-4 '>
        {/* Enhanced Profile Header */}
        <div className='relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20 overflow-hidden'>
          {/* Gradient Overlay */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5'></div>

          <div className='relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6'>
            <div className='flex items-center group'>
              <div className='relative'>
                <div className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1 mr-6'>
                  <div className='bg-white rounded-full p-4'>
                    <User className='size-10  text-purple-600 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text' />
                  </div>
                </div>
                <div className='absolute -top-2 -right-[-15px] w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white shadow-lg animate-pulse'></div>
              </div>
              <div className='space-y-2'>
                <h1 className='text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent'>
                  {profileData?.data?.name || 'User'}
                </h1>
                <p className='text-gray-600 text-lg font-medium'>
                  {profileData?.data?.email}
                </p>
                <div className='flex items-center space-x-4 text-sm text-gray-500'>
                  <div className='flex items-center'>
                    <Calendar className='h-4 w-4 mr-1' />
                    Member since{' '}
                    {getTimeAgo(profileData?.data?.createdAt as string)}
                  </div>
                  <div className='flex items-center'>
                    <BookOpen className='h-4 w-4 mr-1' />
                    {notesCount} Notes
                  </div>
                </div>
              </div>
            </div>

            {/*  Stats Cards */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                onClick={handleLogout}
                className='group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl overflow-hidden'
              >
                <div className='flex items-center relative z-10'>
                  <LogOut className='h-5 w-5 mr-2' />
                  <span className='font-semibold'>Logout</span>
                </div>{' '}
              </button>
            </div>
          </div>
        </div>

        {/*  Notes Section */}
        <div className='relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 overflow-hidden'>
          {/* Section Header */}
          <div className='flex justify-between items-center mb-8'>
            <div className='flex items-center space-x-3'>
              <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2'>
                <Sparkles className='h-6 w-6 text-white' />
              </div>
              <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                My Notes Collection
              </h2>
            </div>

            <Link
              to='/create'
              className='group relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
              <Plus className='mr-3 h-6 w-6 relative z-10 group-hover:rotate-90 transition-transform duration-300' />
              <span className='relative z-10 text-lg'>Create Note</span>
            </Link>
          </div>

          {/* Empty State */}
          {notesData?.data?.length === 0 && (
            <div className='flex flex-col items-center justify-center text-center py-20'>
              <div className='relative mb-8'>
                <div className='w-48 h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6'>
                  <BookOpen className='w-20 h-20 text-gray-400' />
                </div>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-10 animate-ping'></div>
              </div>
              <h3 className='text-3xl font-bold text-gray-700 mb-3'>
                Your Story Starts Here
              </h3>
              <p className='text-gray-500 text-lg mb-8 max-w-md'>
                Every great journey begins with a single step. Create your first
                note and start documenting your thoughts, ideas, and
                inspirations.
              </p>
              <Link
                to='/create'
                className='group inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
                <Plus className='w-5 h-5 mr-3 relative z-10 group-hover:rotate-90 transition-transform duration-300' />
                <span className='relative z-10'>Create Your First Note</span>
              </Link>
            </div>
          )}

          {/* Notes Grid */}
          {Array.isArray(notesData?.data) && notesData.data.length > 0 && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <p className='text-gray-600 text-lg font-bold tracking-tighter'>
                  {notesCount} {notesCount === 1 ? 'note' : 'notes'} in your
                  collection
                </p>
                <div className='flex items-center space-x-2 text-sm text-gray-500'>
                  <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                  <span>Recently updated</span>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6'>
                {notesData.data.map((note, index) => (
                  <div
                    key={note._id}
                    className='transform hover:scale-102 transition-all duration-300'
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <NoteCard
                      note={note}
                      handleDeleteClick={handleDeleteClick}
                      isUserNote={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Delete Modal */}
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
