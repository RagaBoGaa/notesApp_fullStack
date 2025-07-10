import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useRegisterMutation } from '@/api/cruds/auth/auth';
import { registerSchema, RegisterFormValues } from '@/lib/schemas';
import { toast } from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data).unwrap();
      navigate('/login');
      toast.success('You can now login to your account');
    } catch (error: any) {
      toast.error(
        error?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div className='flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          Create your account
        </h2>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Full Name
              </label>
              <div className='mt-2'>
                <input
                  id='name'
                  type='text'
                  autoComplete='name'
                  {...registerField('name')}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.name
                      ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500'
                      : 'ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600'
                  } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 px-3`}
                />
                {errors.name && (
                  <p className='mt-2 text-sm text-red-600'>
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  type='email'
                  autoComplete='email'
                  {...registerField('email')}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.email
                      ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500'
                      : 'ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600'
                  } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 px-3`}
                />
                {errors.email && (
                  <p className='mt-2 text-sm text-red-600'>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Password
              </label>
              <div className='mt-2 relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='new-password'
                  {...registerField('password')}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.password
                      ? 'ring-red-300 placeholder:text-red-300 focus:ring-red-500'
                      : 'ring-gray-300 placeholder:text-gray-400 focus:ring-blue-600'
                  } focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 px-3`}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                {errors.password && (
                  <p className='mt-2 text-sm text-red-600'>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='flex w-full justify-center rounded-md bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-600 hover:to-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-white px-2 text-gray-500'>
                  Already have an account?
                </span>
              </div>
            </div>

            <div className='mt-6'>
              <Link
                to='/login'
                className='flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
