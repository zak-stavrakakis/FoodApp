import Header from './Header.jsx';
import Meals from './Meals.jsx';
import Meal from './Meal.jsx';
import { useSelector } from 'react-redux';

export default function Shop({  onLogout }) {
  const mealsItems = useSelector((state) => state.meals.items);
  console.log(mealsItems);

  return (
    <>
      <Header onLogout={onLogout} />
      <Meals>
        {mealsItems.map((meal) => (
          <li key={meal.id} className='meal-item'>
            <Meal {...meal} />
          </li>
        ))}
      </Meals>
    </>
  );
}
