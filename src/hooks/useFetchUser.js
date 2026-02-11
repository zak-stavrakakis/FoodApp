import { useCallback, useEffect, useState } from 'react';
import { userActions } from '../redux-store/user-slice';
import { useDispatch, useSelector } from 'react-redux';

export default function useFetchUser() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);

  const fetchUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:3000/auth/user', {
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
