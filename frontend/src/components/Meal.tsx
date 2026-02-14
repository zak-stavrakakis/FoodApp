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
        <img src={AppConfig.toServerImage(`${image}`)} alt={name} />
        <div className='product-content'>
          <div>
            <h3>{name}</h3>
            <p className='meal-item-price'>${price}</p>
            <p className='meal-item-description'>{description}</p>
          </div>
          <p className='meal-item-actions'>
            {user.role === 'user' ? (
              <button onClick={addToCartHandler} className='button'>
                Add to Cart
              </button>
            ) : (
              <button className='button' onClick={handleOpenModalClick}>
                Update Meal
              </button>
            )}
          </p>
        </div>
      </article>
    </>
  );
}
