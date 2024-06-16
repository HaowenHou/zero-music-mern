import axios from 'axios';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { formatImageUrl } from '../utils/url';

const Register = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(import.meta.env.VITE_SERVER_URL + '/assets/default-avatar-s.png');
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  function handleAvatarChange(ev) {
    const file = ev.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const formData = { username, name, password };
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('password', password);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 201) {
        alert('注册成功，请登录');
        navigate('/login');
      } else if (response.status === 409) {
        alert('用户名已被注册');
      } else {
        console.error('Registration failed', response.data);
      }
    } catch (error) {
      console.error('Registration failed', error.response.data);
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
          <Link to="/login" className='pr-2'>登录</Link>
        </div>

        <h2 className="text-lg font-bold mb-8">新用户注册</h2>
        <label htmlFor="username" className="block mb-2">头像</label>
        <label className="my-2 mx-auto cursor-pointer relative flex w-36 h-36">
          <input type="file" className="hidden" onChange={handleAvatarChange} />
          <img src={formatImageUrl(avatar)} className="w-full h-full object-cover border rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <span className="text-black font-semibold">更换头像</span>
          </div>
        </label>
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
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">昵称</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2">密码</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="on"
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full p-3 bg-orange-400 text-white rounded hover:bg-orange-500">
          注册
        </button>
      </form>
    </div>
  );
};

export default Register;
