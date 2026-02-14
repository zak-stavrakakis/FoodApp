import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useToken from '../hooks/useToken';
import { useDispatch } from 'react-redux';
import { userActions } from '../redux-store/user-slice';
import { AppConfig } from '../config';

export default function Login({}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const token = useToken();
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(AppConfig.toApiUrl('auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        dispatch(userActions.setToken(null));
        dispatch(userActions.setUser({}));
        alert('Login failed');
        return;
      }
      const data = await res.json();
      dispatch(userActions.setToken(data.token));
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  if (token) {
    return null;
  }

  return (
    <div className='login-page'>
      <form className='login-form' onSubmit={submit}>
        <h2 className='login-title'>Login</h2>

        <input
          className='login-input'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className='login-input'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className='login-button'>Login</button>
      </form>
    </div>
  );
}
