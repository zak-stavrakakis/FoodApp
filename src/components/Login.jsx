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
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  );
}
