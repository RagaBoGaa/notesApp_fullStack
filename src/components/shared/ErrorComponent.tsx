import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';

const ErrorComponent = ({
  error,
  onRetry,
  type = 'fetch',
}: {
  error: any;
  onRetry?: () => void;
  type?: 'fetch' | 'not-found' | 'network' | 'generic';
}) => {
  const getErrorMessage = () => {
    if (type === 'not-found') {
      return 'The note you are looking for does not exist or has been deleted.';
    }

    if (type === 'network') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    if (error?.data?.message) {
      return error.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    return 'Something went wrong while loading the note.';
  };

  const getErrorTitle = () => {
    switch (type) {
      case 'not-found':
        return 'Note Not Found';
      case 'network':
        return 'Connection Error';
      default:
        return 'Error Loading Note';
    }
  };

  return (
    <div className='container mx-auto max-w-4xl'>
      <Link
        to='/'
        className='group inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-all duration-300 mb-6 bg-white rounded-full px-4 py-2 shadow-md hover:shadow-lg'
      >
        <ArrowLeft className='h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300' />
        Back to Notes
      </Link>

      <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
        <div className='h-2 bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500'></div>

        <div className='p-8 text-center'>
          <div className='flex justify-center mb-6'>
            <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center'>
              <AlertCircle className='h-10 w-10 text-red-600' />
            </div>
          </div>

          <h1 className='text-3xl font-bold text-gray-800 mb-4'>
            {getErrorTitle()}
          </h1>

          <p className='text-gray-600 mb-8 max-w-md mx-auto'>
            {getErrorMessage()}
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/'
              className='inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'
            >
              <ArrowLeft className='h-5 w-5 mr-2' />
              Back to Notes
            </Link>

            {onRetry && (
              <button
                onClick={onRetry}
                className='inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium'
              >
                <RefreshCw className='h-5 w-5 mr-2' />
                Try Again
              </button>
            )}
          </div>

          {process.env.NODE_ENV === 'development' && error && (
            <details className='mt-8 text-left'>
              <summary className='cursor-pointer text-gray-500 hover:text-gray-700 font-medium'>
                Error Details (Development Only)
              </summary>
              <pre className='mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700 overflow-auto'>
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;
