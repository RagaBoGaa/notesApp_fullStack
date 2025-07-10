import { Loader2Icon } from 'lucide-react';

const LoadingIndicator = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <Loader2Icon className='animate-spin h-12 w-12 text-blue-500' />
    </div>
  );
};

export default LoadingIndicator;
