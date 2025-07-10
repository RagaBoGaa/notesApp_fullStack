import { Link } from 'react-router';
import { useTypedSelector } from '@/api/store/store';
import { useDispatch } from 'react-redux';
import { logout } from '@/state/auth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { LogOut, User, FileText } from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='bg-white shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16 items-center'>
            {/* Logo */}
            <div className='flex items-center'>
              <Link to='/' className='flex items-center'>
                <FileText className='h-8 w-8 text-blue-600 mr-2' />
                <span className='text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Notes App
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className='flex items-center space-x-4'>
              {isAuthenticated ? (
                <>
                  <Link
                    to='/profile'
                    className='text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                  >
                    <User className='h-4 w-4 mr-1' />
                    {user?.name || 'Profile'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium flex items-center'
                  >
                    <LogOut className='h-4 w-4 mr-1' />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to='/login'
                    className='text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    className='bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium'
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className='flex-grow bg-gray-50'>{children}</main>
    </div>
  );
}
