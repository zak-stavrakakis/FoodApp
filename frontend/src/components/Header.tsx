import logoPng from '../assets/logo.jpg';
import { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import CartModal from './CartModal';
import { userActions } from '../redux-store/user-slice';
import { AppConfig } from '../config';
import type { RootState } from '../redux-store';
import type { ModalHandle } from '../types';

export default function Header() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const modal = useRef<ModalHandle>(null);

  const cartQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity,
  );
  const navigate = useNavigate();

  function handleOpenCartClick() {
    modal.current?.open();
  }

  const handleLogout = async () => {
    try {
      const res = await fetch(AppConfig.toApiUrl('auth/logout'), {
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
      <CartModal ref={modal} title='Your Cart' />
      <header className='flex justify-between items-center py-12 px-[10%]'>
        <div className='flex justify-start items-center'>
          <div className='flex gap-4 items-center'>
            <img
              src={logoPng}
              alt='logo'
              className='w-16 h-16 object-contain rounded-full border-2 border-gold'
            />
            <p>REACTFOOD</p>
          </div>
          <nav className='ml-20'>
            <Link
              to='/'
              className='relative mr-4 text-lg font-semibold text-white transition duration-300 hover:text-amber-400 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full'
            >
              Shop
            </Link>
            {user.role === 'user' && (
              <Link
                to='/orders'
                className='relative mr-4 text-lg font-semibold text-white transition duration-300 hover:text-amber-400 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all after:duration-300 hover:after:w-full'
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
              className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded text-2xl font-lato mr-8 hover:bg-gold-dark hover:border-gold-dark'
            >
              Cart <span>({cartQuantity})</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-2 px-6 rounded text-2xl font-lato hover:bg-gold-dark hover:border-gold-dark'
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
}
