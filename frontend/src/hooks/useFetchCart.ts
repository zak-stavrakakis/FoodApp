import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useToken from './useToken';
import { cartActions } from '../redux-store/cart-slice';
import { AppConfig } from '../config';
import type { RootState } from '../redux-store';
import type { CartState } from '../types';

export default function useFetchCart(): CartState {
  const dispatch = useDispatch();
  const token = useToken();
  const cart = useSelector((state: RootState) => state.cart);

  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(AppConfig.toApiUrl('cart'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      dispatch(cartActions.replaceCart(data));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  return cart;
}
