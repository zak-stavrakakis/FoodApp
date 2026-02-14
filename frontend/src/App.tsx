import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Shop from './components/Shop';
import Orders from './components/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import useToken from './hooks/useToken';
import useFetchUser from './hooks/useFetchUser';
import useFetchCart from './hooks/useFetchCart';
import Header from './components/Header';

function App() {
  const user = useFetchUser();
  const token = useToken();
  useFetchCart();

  return (
    <>
      {user?.id ? <Header /> : null}
      <Routes>
        <Route
          path='/login'
          element={token ? <Navigate to='/' replace /> : <Login />}
        />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route
          path='/orders'
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  );
}

export default App;
