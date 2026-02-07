import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        onLogin(data.token);
        localStorage.setItem('token', data.token);
        navigate('/', { replace: true });
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

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
