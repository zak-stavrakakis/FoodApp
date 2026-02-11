import { postOrders } from '../http.js';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { cartActions } from '../redux-store/cart-slice';

export default function UserForm({ onClose }) {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  console.log(user);
  const dispatch = useDispatch();
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const street = formData.get('street').trim();
    const postalCode = formData.get('postalCode').trim();
    const city = formData.get('city').trim();

    if (!name || !email || !street || !postalCode || !city) {
      alert('Please fill in all fields.');
      return;
    }
    const data = Object.fromEntries(formData.entries());

    const order = {
      customer: data,
      items: cartItems,
    };

    console.log(order);

    try {
      await postOrders(order);
      dispatch(cartActions.replaceCart({ totalQuantity: 0, items: [] }));
      onClose();
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <form onSubmit={handleSubmit} className='control'>
      <div className='control'>
        <label>Name</label>
        <input name='name' required />
      </div>

      <div className='control'>
        <label>Email</label>
        <input type='email' name='email' defaultValue={user?.email} required />
      </div>

      <div className='control'>
        <label>Street</label>
        <input name='street' required />
      </div>

      <div className='control'>
        <label>Postal Code</label>
        <input name='postalCode' required />
      </div>

      <div className='control'>
        <label>City</label>
        <input name='city' required />
      </div>

      <div className='modal-actions'>
        <button type='button' onClick={() => onClose()}>
          Close
        </button>

        <button className='button' type='submit'>
          Submit
        </button>
      </div>
    </form>
  );
}
