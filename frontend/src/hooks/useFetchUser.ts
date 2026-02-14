import { useCallback, useEffect } from 'react';
import { userActions } from '../redux-store/user-slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppConfig } from '../config';
import type { RootState } from '../redux-store';
import type { User } from '../types';

export default function useFetchUser(): Partial<User> {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.user);

  const fetchUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(AppConfig.toApiUrl('auth/user'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      dispatch(userActions.setUser(data));
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return user;
}
