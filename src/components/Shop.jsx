import Header from './Header.jsx';
import Meals from './Meals.jsx';
import Meal from './Meal.jsx';

export default function Shop({ meals, onLogout }) {
  return (
    <>
      <Header onLogout={onLogout} />
      <Meals>
        {meals.map((meal) => (
          <li key={meal.id} className='meal-item'>
            <Meal {...meal} />
          </li>
        ))}
      </Meals>
    </>
  );
}
