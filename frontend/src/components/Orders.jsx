import Order from './Order.jsx';
import { useState, useEffect } from 'react';
import { fetchAllOrders } from '../http.js';
import useToken from '../hooks/useToken.js';

export default function Orders({}) {
  const [orders, setOrders] = useState([]);
  const token = useToken();
  useEffect(() => {
    async function fetchOrders() {
      if (!token) {
        return;
      }
      try {
        const data = await fetchAllOrders(token);
        setOrders(data);
      } catch (err) {}
    }
    fetchOrders();
  }, [token]);
  return (
    <>
      <ul id='meals'>
        {orders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </ul>
    </>
  );
}
