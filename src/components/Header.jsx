import logoPng from '../assets/logo.jpg';
import { FoodCartContext } from '../store/food-cart-context';
import { useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import CartModal from './CartModal.jsx';

export default function Header({ onLogout }) {
  const modal = useRef();
  // const { items } = useContext(FoodCartContext);

  // const cartQuantity = items.length;
  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate();

  function handleOpenCartClick() {
    modal.current.open();
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/auth/logout', { method: 'POST' });
      onLogout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <CartModal ref={modal} title='Your Cart' cartQuantity={cartQuantity} />
      <header id='main-header'>
        <div id='title'>
          <img src={logoPng} alt='logo' />
          <p>REACTFOOD</p>
        </div>
        <div>
          <button onClick={handleOpenCartClick}>
            Cart <span>({cartQuantity})</span>
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <nav>
          <Link to='/' style={{ marginRight: '10px' }}>
            Shop
          </Link>
          <Link to='/orders'>Orders</Link>
        </nav>
      </header>
    </>
  );
}
