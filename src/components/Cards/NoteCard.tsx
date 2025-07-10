import React from 'react';
import { Calendar, Clock, Pencil, Trash2, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { getTimeAgo } from '@/utilities/formatDate';
import { useTypedSelector } from '@/api/store/store';
import { Note } from '@/types/notes';

interface NoteCardProps {
  note: Note;
  handleDeleteClick: (note: Note) => void;
  isUserNote?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  handleDeleteClick,
  isUserNote = false,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useTypedSelector((state) => state.auth);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        navigate(isUserNote ? `/edit/${note._id}` : `/noteDetails/${note._id}`);
      }}
      key={note._id}
      className='group relative bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl border border-gray-100 cursor-pointer'
    >
      <div className='h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 group-hover:h-1.5 transition-all duration-300'></div>

      <div className='p-4 h-full flex flex-col'>
        <h2 className='text-lg font-bold mb-2 text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300'>
          {note.title}
        </h2>
        <p className='text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed flex-grow'>
          {note.content}
        </p>

        <div className='space-y-1 mb-3 flex items-center justify-between gap-2'>
          <div className='flex items-center text-xs text-gray-500'>
            <Calendar className='h-3 w-3 mr-1.5 text-green-500' />
            <span className='font-medium'>Created:</span>
            <span className='ml-1 truncate'>{getTimeAgo(note.createdAt)}</span>
          </div>
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <div className='flex items-center text-xs text-gray-500'>
              <Clock className='h-3 w-3 mr-1.5 text-orange-500' />
              <span className='font-medium'>Updated:</span>
              <span className='ml-1 truncate'>
                {getTimeAgo(note.updatedAt)}
              </span>
            </div>
          )}
          <div className='flex items-center text-xs bg-gradient-to-r from-indigo-50 to-purple-50 px-2 py-1 rounded-full border border-indigo-100 group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-300'>
            <div className='relative flex items-center justify-center w-4 h-4 mr-1.5 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full'>
              <User className='h-2.5 w-2.5 text-white' />
            </div>
            <span className='font-semibold text-indigo-700'>by</span>
            <span className='ml-1 truncate font-bold text-indigo-800'>
              {note.user.name}
            </span>
          </div>
        </div>

        {isAuthenticated && (
          <div className='flex justify-end gap-2 mt-auto'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit/${note._id}`);
              }}
              className='group/btn relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300'></div>
              <Pencil className='h-4 w-4 text-blue-600 group-hover/btn:text-white transition-colors duration-300 relative z-10' />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(note);
              }}
              className='group/btn relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200 hover:border-red-300 shadow-sm hover:shadow-md overflow-hidden'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300'></div>
              <Trash2 className='h-4 w-4 text-red-600 group-hover/btn:text-white transition-colors duration-300 relative z-10' />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
