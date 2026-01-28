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

  // let modalActions = <button>Close</button>;

  // if (cartQuantity > 0) {
  //   modalActions = (
  //     <>
  //       <button>Close</button>
  //       <button className='button'>Go to Checkout</button>
  //     </>
  //   );
  // }
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
        </div>
      </header>
    </>
  );
}
