import logoPng from '../assets/logo.jpg';
import { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import CartModal from './CartModal.jsx';
import { userActions } from '../redux-store/user-slice.js';

export default function Header({}) {
  //const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const modal = useRef();

  const cartQuantity = useSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate();

  function handleOpenCartClick() {
    modal.current.open();
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
      });
      if (!res.ok) {
        alert('Failed to logout');
        return;
      }
      dispatch(userActions.setToken(null));
      dispatch(userActions.setUser({}));
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <CartModal ref={modal} title='Your Cart' cartQuantity={cartQuantity} />
      <header id='main-header'>
        <div className='left-header'>
          <div id='title'>
            <img src={logoPng} alt='logo' />
            <p>REACTFOOD</p>
          </div>
          <nav style={{ marginLeft: '5rem' }}>
            {}
            <Link
              to='/'
              style={{
                marginRight: '10px',
                fontSize: '20px',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Shop
            </Link>
            {user.role === 'user' && (
              <Link
                to='/orders'
                style={{
                  marginRight: '10px',
                  fontSize: '20px',
                  color: 'white',
                  textDecoration: 'none',
                }}
              >
                Orders
              </Link>
            )}
          </nav>
        </div>

        <div>
          {user.role === 'user' && (
            <button
              onClick={handleOpenCartClick}
              className='button'
              style={{ marginRight: '2rem' }}
            >
              Cart <span>({cartQuantity})</span>
            </button>
          )}

          <button onClick={handleLogout} className='button'>
            Logout
          </button>
        </div>
      </header>
    </>
  );
}
