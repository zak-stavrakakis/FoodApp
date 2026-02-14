import { useDispatch, useSelector } from 'react-redux';
import { cartActions } from '../redux-store/cart-slice';
import { useRef } from 'react';
import MealModal from './MealModal';
import { AppConfig } from '../config';
import type { RootState } from '../redux-store';
import type { Meal as MealType, ModalHandle } from '../types';

export default function Meal({
  id,
  image,
  name,
  price,
  description,
}: MealType) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.user);

  const modal = useRef<ModalHandle>(null);

  function handleOpenModalClick() {
    modal.current?.open();
  }

  const addToCartHandler = async () => {
    try {
      const res = await fetch(AppConfig.toApiUrl('cart/add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mealId: id,
          name,
          price,
        }),
      });
      if (!res.ok) {
        alert('Item was not added to the cart');
        return;
      }
      dispatch(cartActions.addItemToCart({ id, name, price }));
    } catch (err) {
      console.error(err);
      alert('Failed to add item to cart.');
    }
  };
  return (
    <>
      <MealModal
        ref={modal}
        name={name}
        id={id}
        description={description}
        price={price}
      />
      <article>
        <img
          src={AppConfig.toServerImage(`${image}`)}
          alt={name}
          className='w-full h-80 object-cover'
        />
        <div className='flex flex-col items-center gap-4 p-4'>
          <div>
            <h3 className='text-2xl font-bold my-3 font-lato'>{name}</h3>
            <p className='inline-block bg-dark-card text-gold text-sm font-bold py-1 px-8 m-0 rounded'>
              ${price}
            </p>
            <p className='m-4'>{description}</p>
          </div>
          <p className='flex justify-center gap-4'>
            {user.role === 'user' ? (
              <button
                onClick={addToCartHandler}
                className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded hover:bg-gold-dark hover:border-gold-dark'
              >
                Add to Cart
              </button>
            ) : (
              <button
                className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded hover:bg-gold-dark hover:border-gold-dark'
                onClick={handleOpenModalClick}
              >
                Update Meal
              </button>
            )}
          </p>
        </div>
      </article>
    </>
  );
}
