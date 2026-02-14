import type { Order as OrderType } from '../types';

interface OrderProps {
  order: OrderType;
}

export default function Order({ order }: OrderProps) {
  return (
    <div className='order-card'>
      <div className='order-header'>
        <div>
          <h3>Order #{order.id}</h3>
          <span className='order-date'>
            {new Date(order.created_at).toLocaleString()}
          </span>
        </div>

        <div className='order-total'>€{order.total_price}</div>
      </div>

      <div className='order-customer'>
        <p className='customer-name'>{order.customer_name}</p>
        <p className='customer-address'>
          {order.street}, {order.city} {order.postal_code}
        </p>
      </div>

      <div className='order-items'>
        {order.items.map((item) => (
          <div key={item.mealId} className='order-item'>
            <div className='item-info'>
              <span className='item-name'>{item.name}</span>
              <span className='item-qty'>x{item.quantity}</span>
            </div>

            <div className='item-price'>€{item.totalPrice.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className='order-footer'>
        <span>{order.total_quantity} items</span>
        <strong>Total: €{order.total_price}</strong>
      </div>
    </div>
  );
}
