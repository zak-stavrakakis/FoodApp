import Meals from './Meals';
import Meal from './Meal';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { fetchAllMeals } from '../http';
import useToken from '../hooks/useToken';
import { mealsActions } from '../redux-store/meals-slice';
import type { RootState } from '../redux-store';

export default function Shop() {
  const mealsItems = useSelector((state: RootState) => state.meals.items);
  const token = useToken();
  const dispatch = useDispatch();

  const fetchMeals = useCallback(async () => {
    if (!token) {
      dispatch(mealsActions.setMeals([]));
      return;
    }
    try {
      const data = await fetchAllMeals();
      dispatch(mealsActions.setMeals(data));
    } catch (err) {
      console.error('Failed to fetch meals:', err);
    }
  }, [token, dispatch]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return (
    <>
      <Meals>
        {mealsItems.map((meal) => (
          <li key={meal.id} className='bg-dark rounded-2xl overflow-hidden text-center shadow-[0_1px_6px_rgba(0,0,0,0.3)]'>
            <Meal {...meal} />
          </li>
        ))}
      </Meals>
    </>
  );
}
