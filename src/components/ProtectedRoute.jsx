import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ token, children, role }) {
  if (!token) return <Navigate to='/login' replace />;
  if (role === 'admin') return <Navigate to='/' replace />;
  return children;
}
