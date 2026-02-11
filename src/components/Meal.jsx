import { useDispatch } from 'react-redux';
import { cartActions } from '../redux-store/cart-slice';
//import { userActions } from '../redux-store/user-slice';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import MealModal from './MealModal';

export default function Meal({ id, image, name, price, description }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  //console.log(user);

  const modal = useRef();

  function handleOpenModalClick() {
    modal.current.open();
  }

  const addToCartHandler = async () => {
    const token = localStorage.getItem('token');

    await fetch('http://localhost:3000/cart/add', {
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
    dispatch(cartActions.addItemToCart({ id, name, price }));
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
        <img src={`http://localhost:3000/${image}`} alt={name} />
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
