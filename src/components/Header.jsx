import logoPng from '../assets/logo.jpg';
import { useContext } from 'react';
import { FoodCartContext } from '../store/food-cart-context';

export default function Header() {
  const { items } = useContext(FoodCartContext);
  return (
    <header id='main-header'>
      <div id='title'>
        <img src={logoPng} alt='logo' />
        <p>REACTFOOD</p>
      </div>
      <div>
        <button>
          Cart <span>({items.length})</span>
        </button>
      </div>
    </header>
  );
}
