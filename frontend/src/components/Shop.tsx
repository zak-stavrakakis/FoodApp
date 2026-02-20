import Meals from './Meals';
import Meal from './Meal';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { fetchAllMeals } from '../http';
import useToken from '../hooks/useToken';
import { useState } from 'react';
import { mealsActions } from '../redux-store/meals-slice';
import type { RootState } from '../redux-store';

export default function Shop() {
  const mealsItems = useSelector((state: RootState) => state.meals.items);
  const count = useSelector((state: RootState) => state.meals.count);
  const token = useToken();
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const page = 1;
  const pageSize = 6;
  const totalPages = Math.ceil(count / pageSize);

  const dispatch = useDispatch();

  // const fetchMeals = useCallback(async () => {
  //   if (!token) {
  //     dispatch(mealsActions.setMeals({ meals: [], count: 0 }));
  //     return;
  //   }
  //   try {
  //     const data = await fetchAllMeals(page, pageSize);
  //     dispatch(mealsActions.setMeals(data));
  //   } catch (err) {
  //     console.error('Failed to fetch meals:', err);
  //   }
  // }, [token, dispatch]);

  const fetchMeals = useCallback(
    async (pageNumber: number) => {
      if (!token) {
        dispatch(mealsActions.setMeals({ meals: [], count: 0 }));
        return;
      }

      try {
        const data = await fetchAllMeals(
          pageNumber,
          pageSize,
          minPrice ? Number(minPrice) : undefined,
          maxPrice ? Number(maxPrice) : undefined,
        );

        dispatch(mealsActions.setMeals(data));
        setCurrentPage(pageNumber);
      } catch (err) {
        console.error('Failed to fetch meals:', err);
      }
    },
    [token, dispatch, minPrice, maxPrice],
  );

  useEffect(() => {
    fetchMeals(1);
  }, [fetchMeals]);

  // const setPage = async (index: number) => {
  //   try {
  //     const data = await fetchAllMeals(index, pageSize);
  //     dispatch(mealsActions.setMeals(data));
  //   } catch (err) {
  //     console.error('Failed to fetch meals:', err);
  //   }
  // };

  return (
    <>
      <div className='w-[90%] max-w-[70rem] list-none mx-auto my-8 p-4'>
        <div className='flex justify-between'>
          <div>
            <p className='font-medium text-2xl pb-2'>Pages</p>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => fetchMeals(index + 1)}
                className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded text-2xl font-lato mr-8 hover:bg-gold-dark hover:border-gold-dark'
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className='mt-8 flex gap-4 items-center'>
            <input
              type='number'
              placeholder='Min price'
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className='p-2 rounded border'
            />

            <input
              type='number'
              placeholder='Max price'
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className='p-2 rounded border'
            />
          </div>
        </div>
      </div>
      <Meals>
        {mealsItems.map((meal) => (
          <li
            key={meal.id}
            className='bg-dark rounded-2xl overflow-hidden text-center shadow-[0_1px_6px_rgba(0,0,0,0.3)]'
          >
            <Meal {...meal} />
          </li>
        ))}
      </Meals>
    </>
  );
}
