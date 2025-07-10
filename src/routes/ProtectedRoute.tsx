import { Navigate } from 'react-router';
import { useTypedSelector } from '@/api/store/store';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useTypedSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (
    allowedRoles.length > 0 &&
    user?.type &&
    !allowedRoles.includes(user.type)
  ) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
