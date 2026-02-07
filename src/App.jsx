// import { useRef, useState, useCallback, useEffect } from 'react';
// import Header from './components/Header';
// import FoodContextProvider from './store/food-cart-context.jsx';
// import Meals from './components/Meals.jsx';
// import Meal from './components/Meal.jsx';
// import Login from './components/Login.jsx';
// import { fetchAllMeals, fetchAllOrders } from './http.js';
// import { useDispatch } from 'react-redux';
// import { cartActions } from './redux-store/cart-slice.js';

// function App() {
//   const [meals, setMeals] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [isFetching, setIsFetching] = useState(false);
//   const [error, setError] = useState();
//   const token = localStorage.getItem('token');

//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchCart = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) return;

//       try {
//         const response = await fetch('http://localhost:3000/cart', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error('Failed to fetch cart');

//         const data = await response.json();
//         // dispatch to replaceCart
//         dispatch(cartActions.replaceCart(data));
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchCart();
//   }, [dispatch]);

//   useEffect(() => {
//     async function fetchMeals() {
//       setIsFetching(true);
//       try {
//         const meals = await fetchAllMeals();
//         setMeals(meals);
//       } catch (error) {
//         setError({ message: error.message || 'Failed to fetch meals.' });
//       }
//     }

//     fetchMeals();
//   }, []);

//   useEffect(() => {
//     async function fetchOrders() {
//       setIsFetching(true);
//       try {
//         const orders = await fetchAllOrders();
//         console.log(orders);

//         setOrders(orders);
//       } catch (error) {
//         setError({ message: error.message || 'Failed to fetch meals.' });
//       }
//     }

//     fetchOrders();
//   }, []);

//   return !token ? (
//     <Login onLogin={() => window.location.reload()} />
//   ) : (
//     <>
//       <Header />
//       {/* <h1>You got this 💪</h1>
//       <p>Stuck? Not sure how to proceed?</p>
//       <p>Don't worry - we've all been there. Let's build it together!</p> */}
//       <Meals>
//         {meals.map((meal) => (
//           <li key={meal.id} className='meal-item'>
//             <Meal {...meal} />
//           </li>
//         ))}
//       </Meals>
//       {/* {orders.map((order) => (
//         <li key={order.id} className='meal-item'>
//           {order.id}
//         </li>
//       ))} */}
//     </>
//   );
// }

// export default App;

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
  }, []);

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchOrders();
  }, []);

  // Fetch cart from backend
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
              <Orders orders={orders} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
