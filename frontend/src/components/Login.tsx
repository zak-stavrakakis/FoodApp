import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useToken from '../hooks/useToken';
import { useDispatch } from 'react-redux';
import { userActions } from '../redux-store/user-slice';
import { AppConfig } from '../config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const token = useToken();
  const dispatch = useDispatch();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-b from-[#29251c] to-[#2c2306]'>
      <form
        className='bg-dark rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.5)] p-10 flex flex-col gap-5 w-full max-w-md'
        onSubmit={submit}
      >
        <h2 className='text-center text-3xl font-bold font-lato text-gold mb-2'>
          Login
        </h2>

        <input
          className='font-inherit p-3 rounded-lg border border-input-border bg-[#2a2518] text-body-text text-base placeholder:text-gray-400 focus:outline-none focus:border-input-focus'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className='font-inherit p-3 rounded-lg border border-input-border bg-[#2a2518] text-body-text text-base placeholder:text-gray-400 focus:outline-none focus:border-input-focus'
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className='font-inherit cursor-pointer bg-gold border border-gold text-dark-brown py-3 px-6 rounded-lg text-xl font-lato font-bold hover:bg-gold-dark hover:border-gold-dark transition-colors'>
          Login
        </button>
      </form>
    </div>
  );
}
