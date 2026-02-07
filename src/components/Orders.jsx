import Header from './Header.jsx';

export default function Orders({ orders, onLogout }) {
  return (
    <>
      <Header onLogout={onLogout} />
      <h2>Your Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.id}</li>
        ))}
      </ul>
    </>
  );
}
