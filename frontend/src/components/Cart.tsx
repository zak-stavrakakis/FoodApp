import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../redux-store/cart-slice';
import useToken from '../hooks/useToken';
import { AppConfig } from '../config';
import type { RootState } from '../redux-store';
import type { CartItem } from '../types';

interface CartProps {
  onClose: () => void;
  onCheckout: () => void;
}

export default function Cart({ onClose, onCheckout }: CartProps) {
  const token = useToken();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const formattedTotalPrice = `$${totalPrice.toFixed(2)}`;

  const removeItemHandler = async (item: CartItem) => {
    const res = await fetch(AppConfig.toApiUrl('cart/remove'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mealId: item.id,
      }),
    });
    if (!res.ok) {
      alert('Item was not removed from the cart');
      return;
    }
    dispatch(cartActions.removeItemFromCart(item.id));
  };

  const addItemHandler = async (item: CartItem) => {
    try {
      const res = await fetch(AppConfig.toApiUrl('cart/add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mealId: item.id,
          name: item.name,
          price: item.price,
        }),
      });
      if (!res.ok) {
        alert('Item was not added to the cart');
        return;
      }
      dispatch(
        cartActions.addItemToCart({
          id: item.id,
          name: item.name,
          price: item.price,
        }),
      );
    } catch (err) {
      console.error(err);
      alert('Failed to add item to cart.');
    }
  };

  return (
    <div className='card'>
      {cartItems.length === 0 && <p>No items in cart!</p>}
      {cartItems.length > 0 && (
        <ul>
          {cartItems.map((item) => {
            return (
              <li key={item.id} className='cart-item'>
                <div>
                  <span>{item.name}</span>
                  <span> ({item.totalPrice.toFixed(2)})</span>
                </div>
                <div className='cart-item-actions'>
                  <button onClick={() => removeItemHandler(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addItemHandler(item)}>+</button>
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
        <button onClick={onClose} className='button'>
          Close
        </button>

        {cartItems.length > 0 && (
          <button className='button' onClick={onCheckout}>
            Go to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
