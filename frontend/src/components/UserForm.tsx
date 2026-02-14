import { postOrders } from '../http';
import { useSelector, useDispatch } from 'react-redux';
import { cartActions } from '../redux-store/cart-slice';
import type { RootState } from '../redux-store';

interface UserFormProps {
  onClose: () => void;
  onGoBack: () => void;
}

export default function UserForm({ onClose, onGoBack }: UserFormProps) {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = (formData.get('name') as string).trim();
    const email = (formData.get('email') as string).trim();
    const street = (formData.get('street') as string).trim();
    const postalCode = (formData.get('postalCode') as string).trim();
    const city = (formData.get('city') as string).trim();

    if (!name || !email || !street || !postalCode || !city) {
      alert('Please fill in all fields.');
      return;
    }
    const data = Object.fromEntries(formData.entries());

    const order = {
      customer: data,
      items: cartItems,
    };

    try {
      await postOrders(order);
      dispatch(cartActions.replaceCart({ totalQuantity: 0, items: [] }));
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to submit order. Please try again.');
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
        <button className='button' type='button' onClick={() => onGoBack()}>
          Back to Cart
        </button>
        <button className='button' type='button' onClick={() => onClose()}>
          Close
        </button>
        <button className='button' type='submit'>
          Submit
        </button>
      </div>
    </form>
  );
}
