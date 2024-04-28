import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password
      });
      if (response.status === 200) {
        Router.push('/dashboard');  // Redirect to a dashboard or home page on successful login
      }
    } catch (error) {
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div >
      <form onSubmit={handleLogin} >
        <h1>Login</h1>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Log In</button>
        </div>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
