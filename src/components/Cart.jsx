import { FoodCartContext } from '../store/food-cart-context';
import { useContext } from 'react';

export default function Cart({ onClose, onCheckout }) {
  const { items, updateItemQuantity } = useContext(FoodCartContext);

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const formattedTotalPrice = `$${totalPrice.toFixed(2)}`;

  return (
    <div className='card'>
      {items.length === 0 && <p>No items in cart!</p>}
      {items.length > 0 && (
        <ul>
          {items.map((item) => {
            //const formattedPrice = `$${item.price.toFixed(2)}`;

            return (
              <li key={item.id} className='cart-item'>
                <div>
                  <span>{item.name}</span>
                  <span> ({item.price})</span>
                </div>
                <div className='cart-item-actions'>
                  <button onClick={() => updateItemQuantity(item.id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateItemQuantity(item.id, 1)}>
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className='cart-total'>
        Cart Total: <strong>{formattedTotalPrice}</strong>
      </p>
      <div className='modal-actions'>
        <button onClick={onClose}>Close</button>

        {items.length > 0 && (
          <button className='button' onClick={onCheckout}>
            Go to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
