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
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'>
      {/* Animated Background Elements */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30 animate-blob'></div>
        <div className='absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30 animate-blob animation-delay-2000'></div>
        <div className='absolute top-20 left-20 sm:top-40 sm:left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30 animate-blob animation-delay-4000'></div>
      </div>

      <div className='relative max-w-7xl mx-auto p-3 sm:p-4 lg:p-6'>
        {/* Enhanced Profile Header */}
        <div className='relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border border-white/30 overflow-hidden'>
          {/* Gradient Overlay */}
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5'></div>

          <div className='relative flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center'>
            {/* Profile Info */}
            <div className='flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6'>
              <div className='relative flex justify-center sm:justify-start'>
                <div className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1'>
                  <div className='bg-white rounded-full p-3 sm:p-4'>
                    <User className='size-8 sm:size-10 text-purple-600' />
                  </div>
                </div>
                <div className='absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-white shadow-lg animate-pulse'></div>
              </div>

              <div className='space-y-2 text-center sm:text-left'>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent leading-tight'>
                  {profileData?.data?.name || 'User'}
                </h1>
                <p className='text-gray-600 text-sm sm:text-base lg:text-lg font-medium break-all sm:break-normal'>
                  {profileData?.data?.email}
                </p>
                <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-500'>
                  <div className='flex items-center justify-center sm:justify-start'>
                    <Calendar className='h-3 w-3 sm:h-4 sm:w-4 mr-1' />
                    <span>
                      Member since{' '}
                      {getTimeAgo(profileData?.data?.createdAt as string)}
                    </span>
                  </div>
                  <div className='flex items-center justify-center sm:justify-start'>
                    <BookOpen className='h-3 w-3 sm:h-4 sm:w-4 mr-1' />
                    <span>{notesCount} Notes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
              <button
                onClick={handleLogout}
                className='group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl overflow-hidden text-sm sm:text-base'
              >
                <div className='flex items-center justify-center relative z-10'>
                  <LogOut className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                  <span className='font-semibold'>Logout</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className='relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/30 overflow-hidden'>
          {/* Section Header */}
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8'>
            <div className='flex items-center space-x-3'>
              <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2'>
                <Sparkles className='h-5 w-5 sm:h-6 sm:w-6 text-white' />
              </div>
              <h2 className='text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                My Notes Collection
              </h2>
            </div>

            <Link
              to='/create'
              className='group relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg sm:shadow-xl transform hover:scale-105 hover:shadow-2xl overflow-hidden text-sm sm:text-base lg:text-lg'
            >
              <div className='absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700'></div>
              <Plus className='mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 relative z-10 group-hover:rotate-90 transition-transform duration-300' />
              <span className='relative z-10'>Create Note</span>
            </Link>
          </div>

          {/* Empty State */}
          {notesData?.data?.length === 0 && (
            <div className='flex flex-col items-center justify-center text-center py-12 sm:py-20'>
              <div className='relative mb-6 sm:mb-8'>
                <div className='w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 sm:mb-6'>
                  <BookOpen className='w-12 h-12 sm:w-20 sm:h-20 text-gray-400' />
                </div>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-10 animate-ping'></div>
              </div>
              <h3 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 mb-3'>
                Your Story Starts Here
              </h3>
              <p className='text-gray-500 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-md px-4 sm:px-0'>
                Every great journey begins with a single step. Create your first
                note and start documenting your thoughts, ideas, and
                inspirations.
              </p>
              <Link
                to='/create'
                className='group inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl overflow-hidden text-sm sm:text-base'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
                <Plus className='w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 relative z-10 group-hover:rotate-90 transition-transform duration-300' />
                <span className='relative z-10'>Create Your First Note</span>
              </Link>
            </div>
          )}

          {/* Notes Grid */}
          {Array.isArray(notesData?.data) && notesData.data.length > 0 && (
            <div className='space-y-4 sm:space-y-6'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4'>
                <p className='text-gray-600 text-sm sm:text-base lg:text-lg font-bold tracking-tight'>
                  {notesCount} {notesCount === 1 ? 'note' : 'notes'} in your
                  collection
                </p>
                <div className='flex items-center space-x-2 text-xs sm:text-sm text-gray-500'>
                  <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                  <span>Recently updated</span>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
                {notesData.data.map((note, index) => (
                  <div
                    key={note._id}
                    className='transform hover:scale-102 transition-all duration-300 animate-fade-in'
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
