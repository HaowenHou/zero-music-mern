import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken, setUserId, setName, setAvatar, setRole, login } from '../redux/actionCreators';
import { logoutUser } from '../utils/loginStatus';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginPayload = {
      username,
      password
    };

    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/login', loginPayload);
      if (response.status === 200) {
        const { token, userId, name, avatar, role } = response.data;
        dispatch(setToken(token));
        dispatch(setUserId(userId));
        dispatch(setName(name));
        dispatch(setAvatar(avatar));
        dispatch(setRole(role));
        dispatch(login());
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/');
      } else {
        logoutUser(dispatch);
        console.error('Failed to login');
      }
    } catch (error) {
      if (error.response.status === 404) {
        alert('用户名错误');
      } else if (error.response.status === 401) {
        alert('密码错误');
      } else {
        alert('登录失败');
      }
      console.error('Failed to login', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <form className="px-12 py-8 bg-white rounded shadow-md" onSubmit={handleSubmit}>
        <div className='flex justify-between pb-8'>
          <Link to="/" className='flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            首页
          </Link>
          <Link to="/register" className='pr-2'>注册</Link>
        </div>

        <h2 className="text-lg font-bold mb-8">用户登录</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">用户名</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            className="w-full p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">密码</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full p-2 border border-gray-300 rounded"
            autoComplete="on"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full p-3 bg-orange-400 text-white rounded hover:bg-orange-500">
          登录
        </button>
      </form>
    </div>
  );
};

export default Login;
