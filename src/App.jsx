import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Shop from './components/Shop.jsx';
import Orders from './components/Orders.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import useToken from './hooks/useToken.js';
import useFetchUser from './hooks/useFetchUser.js';
import useFetchCart from './hooks/useFetchCart.js';
import Header from './components/Header.jsx';

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
