import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { cartActions } from '../redux-store/cart-slice';

export default function Cart({ onClose, onCheckout }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const formattedTotalPrice = `$${totalPrice.toFixed(2)}`;

  const removeItemHandler = async (item) => {
    dispatch(cartActions.removeItemFromCart(item.id));

    const token = localStorage.getItem('token');

    await fetch('http://localhost:3000/cart/remove', {
      method: 'POST', // or PATCH
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mealId: item.id,
      }),
    });
  };

  const addItemHandler = async (item) => {
    dispatch(
      cartActions.addItemToCart({
        id: item.id,
        name: item.name,
        price: item.price,
      }),
    );

    const token = localStorage.getItem('token');

    await fetch('http://localhost:3000/cart/add', {
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
  };

  return (
    <div className='card'>
      {cartItems.length === 0 && <p>No items in cart!</p>}
      {cartItems.length > 0 && (
        <ul>
          {cartItems.map((item) => {
            //const formattedPrice = `$${item.price.toFixed(2)}`;

            return (
              <li key={item.id} className='cart-item'>
                <div>
                  <span>{item.name}</span>
                  <span> ({item.totalPrice})</span>
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
        <button onClick={onClose}>Close</button>

        {cartItems.length > 0 && (
          <button className='button' onClick={onCheckout}>
            Go to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
