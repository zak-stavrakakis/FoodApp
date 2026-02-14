import Meals from './Meals.jsx';
import Meal from './Meal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { fetchAllMeals } from '../http.js';
import useToken from '../hooks/useToken.js';
import { mealsActions } from '../redux-store/meals-slice.js';

export default function Shop({}) {
  const mealsItems = useSelector((state) => state.meals.items);
  const token = useToken();
  const dispatch = useDispatch();

  const fetchMeals = useCallback(async () => {
    if (!token) {
      dispatch(mealsItems.setMeals([]));
      return;
    }
    try {
      const data = await fetchAllMeals();
      dispatch(mealsActions.setMeals(data));
    } catch (err) {}
  }, [token]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return (
    <>
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
