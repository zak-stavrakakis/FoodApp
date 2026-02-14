import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux-store';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { pathname } = useLocation();
  const { user, token } = useSelector((state: RootState) => state.user);
  if (!token) return <Navigate to='/login' replace />;
  if (user?.role === 'admin' && pathname.startsWith('/orders')) {
    return <Navigate to='/' replace />;
  }

  return children;
}
