import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { cartActions } from '../redux-store/cart-slice';

import { FoodCartContext } from '../store/food-cart-context';

export default function Meal({ id, image, name, price, description }) {
  //const { addItemToCart } = useContext(FoodCartContext);
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(cartActions.addItemToCart({ id, name, price }));
  };
  return (
    <article>
      <img src={`http://localhost:3000/${image}`} alt={name} />
      <div className='product-content'>
        <div>
          <h3>{name}</h3>
          <p className='meal-item-price'>${price}</p>
          <p className='meal-item-description'>{description}</p>
        </div>
        <p className='meal-item-actions'>
          <button onClick={addToCartHandler}>Add to Cart</button>
        </p>
      </div>
    </article>
  );
}
