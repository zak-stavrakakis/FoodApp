import { useRef, useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import FoodContextProvider from './store/food-cart-context.jsx';
import Meals from './components/Meals.jsx';
import Meal from './components/Meal.jsx';
import Login from './components/Login.jsx';
import { fetchAllMeals } from './http.js';

function App() {
  const [meals, setMeals] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState();
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchMeals() {
      setIsFetching(true);
      try {
        const meals = await fetchAllMeals();
        setMeals(meals);
      } catch (error) {
        setError({ message: error.message || 'Failed to fetch meals.' });
      }
    }

    fetchMeals();
  }, []);

  return !token ? (
    <Login onLogin={() => window.location.reload()} />
  ) : (
    <>
      <Header />
      {/* <h1>You got this 💪</h1>
      <p>Stuck? Not sure how to proceed?</p>
      <p>Don't worry - we've all been there. Let's build it together!</p> */}
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

export default App;
