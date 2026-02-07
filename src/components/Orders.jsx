import Header from './Header.jsx';
import Order from './Order.jsx';

export default function Orders({ orders, onLogout }) {
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
