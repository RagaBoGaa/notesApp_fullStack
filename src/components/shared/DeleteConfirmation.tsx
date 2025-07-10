import React, { useEffect, useRef } from 'react';
import { Loader2Icon, Trash2, X } from 'lucide-react';

interface DeleteConfirmationProps {
  handleCancelDelete: () => void;
  itemToDelete: string | null;
  handleConfirmDelete: () => void;
  isDeleting: boolean;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  handleCancelDelete,
  itemToDelete,
  handleConfirmDelete,
  isDeleting,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleCancelDelete();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleCancelDelete]);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div
        ref={modalRef}
        className='bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300'
      >
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Confirm Delete
          </h3>
          <button
            onClick={handleCancelDelete}
            className='text-gray-400 hover:text-gray-600 transition-colors duration-200'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='p-3'>
          <div className='flex items-center mb-4'>
            <div className='flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
              <Trash2 className='h-5 w-5 text-red-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm text-gray-600'>
                Are you sure you want to delete "{itemToDelete as string}"?
              </p>
            </div>
          </div>

          <p className='text-sm text-gray-500 mb-6'>
            This action cannot be undone. The note will be permanently deleted.
          </p>
        </div>

        <div className='flex gap-3 p-6 bg-gray-50 rounded-b-2xl'>
          <button
            onClick={handleCancelDelete}
            className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200'
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className='flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-lg transition-colors duration-200 flex items-center justify-center'
          >
            {isDeleting ? (
              <>
                <Loader2Icon className='animate-spin h-4 w-4 mr-2' />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
