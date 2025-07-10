import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Plus, Edit, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  useAddNoteMutation,
  useGetNoteByIdQuery,
  useGetNoteByIdForUserQuery,
  useUpdateNoteMutation,
} from '@/api/cruds/notesAPI';
import toast from 'react-hot-toast';
import { useTypedSelector } from '@/api/store/store';

const noteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  content: z
    .string()
    .min(1, 'Content is required')
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content must be less than 5000 characters')
    .trim(),
});

const NoteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { isAuthenticated } = useTypedSelector((state) => state.auth);

  const { data: publicNoteData, isLoading: isLoadingPublicNote } =
    useGetNoteByIdQuery(
      { id: `${id}` },
      { skip: !isEditing || isAuthenticated }
    );

  const { data: userNoteData, isLoading: isLoadingUserNote } =
    useGetNoteByIdForUserQuery(
      { id: `${id}` },
      { skip: !isEditing || !isAuthenticated }
    );

  const noteData = isAuthenticated ? userNoteData : publicNoteData;
  const isLoadingNote = isLoadingPublicNote || isLoadingUserNote;

  const [createNote, { isLoading: isCreating }] = useAddNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(noteSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const watchedTitle = watch('title');
  const watchedContent = watch('content');

  useEffect(() => {
    if (isEditing && noteData?.data) {
      reset({
        title: noteData.data.title,
        content: noteData.data.content,
      });
    }
  }, [noteData, reset, isEditing]);

  interface NoteFormData {
    title: string;
    content: string;
  }

  const onSubmit = async (data: NoteFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);

      if (isEditing) {
        await updateNote({ id: id as string, formData }).unwrap();
        navigate(isAuthenticated ? '/profile' : '/');
        toast.success('Note updated successfully!');
      } else {
        await createNote(formData).unwrap();
        navigate(isAuthenticated ? '/profile' : '/');
        toast.success('Note created successfully!');
      }
    } catch (error: any) {
      console.error('Error saving note:', error.message);
      toast.error('Error saving note!');
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingNote;

  return (
    <div>
      <div className='container mx-auto max-w-4xl'>
        <Link
          to={isAuthenticated ? '/profile' : '/'}
          className='group inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 mb-6 bg-white rounded-full px-4 py-2 shadow-md hover:shadow-lg'
        >
          <ArrowLeft className='h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300' />
          {isEditing ? 'Back to Note' : 'Back to Notes'}
        </Link>

        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
          <div className='h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500'></div>

          <div className='p-8 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              {isEditing ? (
                <Edit className='h-8 w-8 text-blue-600' />
              ) : (
                <Plus className='h-8 w-8 text-green-600' />
              )}
              <h1 className='text-3xl font-bold text-gray-800'>
                {isEditing ? 'Edit Note' : 'Create New Note'}
              </h1>
            </div>
            <p className='text-gray-600 mt-2'>
              {isEditing
                ? 'Update your note with new information'
                : 'Create a new note to capture your thoughts'}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='p-8'>
            <div className='mb-6'>
              <label
                htmlFor='title'
                className='block text-sm font-semibold text-gray-700 mb-2'
              >
                Title
              </label>
              <div className='relative'>
                <input
                  id='title'
                  type='text'
                  {...register('title')}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                    errors.title
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder='Enter note title...'
                  disabled={isLoading}
                />
                <div className='absolute right-3 top-3 text-xs text-gray-500'>
                  {watchedTitle?.length || 0}/100
                </div>
              </div>
              {errors.title && (
                <div className='flex items-center gap-1 mt-2 text-red-600'>
                  <AlertCircle className='h-4 w-4' />
                  <span className='text-sm'>{errors.title.message}</span>
                </div>
              )}
            </div>

            <div className='mb-6'>
              <label
                htmlFor='content'
                className='block text-sm font-semibold text-gray-700 mb-2'
              >
                Content
              </label>
              <div className='relative'>
                <textarea
                  id='content'
                  {...register('content')}
                  rows={12}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 resize-none ${
                    errors.content
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder='Write your note content here...'
                  disabled={isLoading}
                />
                <div className='absolute right-3 bottom-3 text-xs text-gray-500'>
                  {watchedContent?.length || 0}/5000
                </div>
              </div>
              {errors.content && (
                <div className='flex items-center gap-1 mt-2 text-red-600'>
                  <AlertCircle className='h-4 w-4' />
                  <span className='text-sm'>{errors.content.message}</span>
                </div>
              )}
            </div>

            <div className='flex justify-between items-center pt-6 border-t border-gray-200'>
              <div className='flex gap-2'>
                <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium'>
                  {watchedContent?.length || 0} characters
                </span>
                <span className='px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium'>
                  {watchedContent?.split(' ').filter((word) => word.length > 0)
                    .length || 0}{' '}
                  words
                </span>
              </div>

              <div className='flex gap-3'>
                <Link
                  to={isAuthenticated ? '/profile' : '/'}
                  className='px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300 bg-gray-100 hover:bg-gray-200 rounded-xl'
                >
                  Cancel
                </Link>
                <button
                  type='submit'
                  disabled={!isValid || !isDirty || isLoading}
                  className={`group relative flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 overflow-hidden ${
                    !isValid || !isDirty || isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {!isLoading && (
                    <div className='absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
                  )}
                  {isLoading ? (
                    <div className='flex items-center'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </div>
                  ) : (
                    <div className='flex items-center relative z-10'>
                      <Save className='h-5 w-5 mr-2' />
                      {isEditing ? 'Update Note' : 'Create Note'}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
