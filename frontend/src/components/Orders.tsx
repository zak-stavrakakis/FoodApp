import Order from './Order';
import { useState, useEffect } from 'react';
import { fetchAllOrders } from '../http';
import useToken from '../hooks/useToken';
import type { Order as OrderType } from '../types';

export default function Orders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const token = useToken();
  useEffect(() => {
    async function fetchOrders() {
      if (!token) {
        return;
      }
      try {
        const data = await fetchAllOrders(token);
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    }
    fetchOrders();
  }, [token]);
  return (
    <>
      <ul className='w-[90%] max-w-[70rem] list-none mx-auto my-8 p-4 grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4'>
        {orders.map((order) => (
          <Order key={order.id} order={order} />
        ))}
      </ul>
    </>
  );
}
