import type { Order as OrderType } from '../types';

interface OrderProps {
  order: OrderType;
}

export default function Order({ order }: OrderProps) {
  return (
    <div className='bg-white rounded-xl shadow-[0_1px_6px_rgba(0,0,0,0.1)] overflow-hidden'>
      <div className='flex justify-between items-start p-5 border-b border-order-border'>
        <div>
          <h3 className='text-lg font-bold text-dark-brown m-0'>
            Order #{order.id}
          </h3>
          <span className='text-sm text-order-gray mt-1 block'>
            {new Date(order.created_at).toLocaleString()}
          </span>
        </div>

        <div className='text-xl font-bold text-order-green'>
          €{order.total_price}
        </div>
      </div>

      <div className='bg-order-customer-bg px-5 py-3 border-b border-order-border'>
        <p className='font-semibold text-dark-brown m-0'>
          {order.customer_name}
        </p>
        <p className='text-sm text-order-gray m-0 mt-1'>
          {order.street}, {order.city} {order.postal_code}
        </p>
      </div>

      <div className='p-5'>
        {order.items.map((item) => (
          <div
            key={item.mealId}
            className='flex justify-between items-center py-2 border-b border-order-border last:border-b-0'
          >
            <div className='flex items-center gap-2'>
              <span className='font-medium text-dark-brown'>{item.name}</span>
              <span className='text-sm text-order-gray'>x{item.quantity}</span>
            </div>

            <div className='font-semibold text-dark-brown'>
              €{item.totalPrice.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between items-center px-5 py-3 bg-order-customer-bg border-t border-order-border'>
        <span className='text-sm text-order-gray'>
          {order.total_quantity} items
        </span>
        <strong className='text-order-green'>
          Total: €{order.total_price}
        </strong>
      </div>
    </div>
  );
}
