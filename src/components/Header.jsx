import logoPng from '../assets/logo.jpg';
import { FoodCartContext } from '../store/food-cart-context';
import { useRef, useContext } from 'react';

import CartModal from './CartModal.jsx';

export default function Header() {
  const modal = useRef();
  const { items } = useContext(FoodCartContext);

  const cartQuantity = items.length;

  function handleOpenCartClick() {
    modal.current.open();
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        //credentials: 'include', // important if using cookies
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // If using JWT stored in localStorage
        localStorage.removeItem('token');

        alert('Logged out successfully!');
        // Redirect to login page
        window.location.href = '/login';
      } else {
        const data = await response.json();
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Network error during logout:', error);
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
      </header>
    </>
  );
}
