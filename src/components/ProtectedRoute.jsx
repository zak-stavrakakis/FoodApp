import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ token, children, admin }) {
  if (!token) return <Navigate to='/login' replace />;
  if (admin) return <Navigate to='/' replace />;
  return children;
}
