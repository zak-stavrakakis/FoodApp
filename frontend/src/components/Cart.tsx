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
    <div>
      {cartItems.length === 0 && (
        <p className='text-dark-brown'>No items in cart!</p>
      )}
      {cartItems.length > 0 && (
        <ul className='list-none p-0 m-0'>
          {cartItems.map((item) => {
            return (
              <li
                key={item.id}
                className='flex justify-between items-center my-2'
              >
                <div className='text-dark-brown'>
                  <span>{item.name}</span>
                  <span> ({item.totalPrice.toFixed(2)})</span>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => removeItemHandler(item)}
                    className='w-6 h-6 rounded-full bg-dark-card text-white border-none cursor-pointer flex items-center justify-center text-base hover:bg-dark-brown hover:text-gold'
                  >
                    -
                  </button>
                  <span className='text-dark-brown font-bold'>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => addItemHandler(item)}
                    className='w-6 h-6 rounded-full bg-dark-card text-white border-none cursor-pointer flex items-center justify-center text-base hover:bg-dark-brown hover:text-gold'
                  >
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className='flex justify-end items-center gap-4 text-cart-total text-lg font-bold my-4'>
        Cart Total: <strong>{formattedTotalPrice}</strong>
      </p>
      <div className='flex justify-end gap-4'>
        <button
          onClick={onClose}
          className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded hover:bg-gold-dark hover:border-gold-dark'
        >
          Close
        </button>

        {cartItems.length > 0 && (
          <button
            className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded hover:bg-gold-dark hover:border-gold-dark'
            onClick={onCheckout}
          >
            Go to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
