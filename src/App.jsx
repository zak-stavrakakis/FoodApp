import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Login from './components/Login.jsx';
import Shop from './components/Shop.jsx';
import Orders from './components/Orders.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { fetchAllMeals, fetchAllOrders } from './http.js';
import { cartActions } from './redux-store/cart-slice.js';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [meals, setMeals] = useState([]);
  const [orders, setOrders] = useState([]);
  const dispatch = useDispatch();

  // Fetch meals
  useEffect(() => {
    async function fetchMeals() {
      try {
        const data = await fetchAllMeals();
        setMeals(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchMeals();
  }, [token]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:3000/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch cart');
        const data = await res.json();
        dispatch(cartActions.replaceCart(data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCart();
  }, [dispatch, token]);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={
            token ? (
              <Navigate to='/' replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path='/'
          element={
            <ProtectedRoute token={token}>
              <Shop meals={meals} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/orders'
          element={
            <ProtectedRoute token={token}>
              <Orders onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
