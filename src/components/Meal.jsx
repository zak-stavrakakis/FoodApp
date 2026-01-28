import { useContext } from 'react';

import { FoodCartContext } from '../store/food-cart-context';

export default function Meal({ id, image, name, price, description }) {
  const { addItemToCart } = useContext(FoodCartContext);
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
          <button onClick={() => addItemToCart({ id, image, name, price, description })}>Add to Cart</button>
        </p>
      </div>
    </article>
  );
}
