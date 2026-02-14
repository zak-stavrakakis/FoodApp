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
    <form onSubmit={handleSubmit} className='my-2 flex flex-col'>
      <div className='my-2 flex flex-col'>
        <label className='font-bold mb-2 text-dark-brown'>Name</label>
        <input
          name='name'
          required
          className='w-full max-w-80 font-inherit p-2 rounded border border-input-border'
        />
      </div>

      <div className='my-2 flex flex-col'>
        <label className='font-bold mb-2 text-dark-brown'>Email</label>
        <input
          type='email'
          name='email'
          defaultValue={user?.email}
          required
          className='w-full max-w-80 font-inherit p-2 rounded border border-input-border'
        />
      </div>

      <div className='my-2 flex flex-col'>
        <label className='font-bold mb-2 text-dark-brown'>Street</label>
        <input
          name='street'
          required
          className='w-full max-w-80 font-inherit p-2 rounded border border-input-border'
        />
      </div>

      <div className='my-2 flex flex-col'>
        <label className='font-bold mb-2 text-dark-brown'>Postal Code</label>
        <input
          name='postalCode'
          required
          className='w-full max-w-80 font-inherit p-2 rounded border border-input-border'
        />
      </div>

      <div className='my-2 flex flex-col'>
        <label className='font-bold mb-2 text-dark-brown'>City</label>
        <input
          name='city'
          required
          className='w-full max-w-80 font-inherit p-2 rounded border border-input-border'
        />
      </div>

      <div className='flex justify-end gap-4 mt-4'>
        <button
          className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded hover:bg-gold-dark hover:border-gold-dark'
          type='button'
          onClick={() => onGoBack()}
        >
          Back to Cart
        </button>
        <button
          className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded hover:bg-gold-dark hover:border-gold-dark'
          type='button'
          onClick={() => onClose()}
        >
          Close
        </button>
        <button
          className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded hover:bg-gold-dark hover:border-gold-dark'
          type='submit'
        >
          Submit
        </button>
      </div>
    </form>
  );
}
