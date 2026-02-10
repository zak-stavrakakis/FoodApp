import Header from './Header.jsx';
import Order from './Order.jsx';
import { useState, useEffect } from 'react';
import { fetchAllMeals, fetchAllOrders } from '../http.js';

export default function Orders({ onLogout }) {
  const [orders, setOrders] = useState([]);

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
  return (
    <>
      <Header onLogout={onLogout} />
      <ul id='meals'>
        {orders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </ul>
    </>
  );
}
