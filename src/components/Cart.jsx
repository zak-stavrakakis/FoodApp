import { FoodCartContext } from '../store/food-cart-context';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { cartActions } from '../redux-store/cart-slice';

export default function Cart({ onClose, onCheckout }) {
  //const { items, updateItemQuantity } = useContext(FoodCartContext);
  //console.log(items);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const formattedTotalPrice = `$${totalPrice.toFixed(2)}`;

  const removeItemHandler = (id) => {
    dispatch(cartActions.removeItemFromCart(id))
  }

  const addItemHandler = (item) => {
    dispatch(cartActions.addItemToCart({ id: item.id, name: item.name, price: item.price }));
  }

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
                  <button onClick={() => removeItemHandler(item.id)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addItemHandler(item)}>
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

        {cartItems.length > 0 && (
          <button className='button' onClick={onCheckout}>
            Go to Checkout
          </button>
        )}
      </div>
    </div>
  );
}
