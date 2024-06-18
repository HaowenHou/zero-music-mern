import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { formatImageUrl } from '../utils/url';
import { useDispatch } from 'react-redux';
import { setName as setGlobalName, setAvatar as setGlobalAvatar } from '../redux/actionCreators';

const UserForm = ({
  _id: userId,
  username: initialUsername = '',
  name: initialName = '',
  avatar: initialAvatar = import.meta.env.VITE_SERVER_URL + '/assets/default-avatar-s.png',
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(initialAvatar);
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    let useDefaultAvatar = false;
    if (initialAvatar.includes('/assets/default-avatar-s.png')) {
      useDefaultAvatar = true;
    }

    // const formData = { username, name, password };
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('password', password);
    formData.append('useDefaultAvatar', useDefaultAvatar);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    if (userId) {
      try {
        const response = await axios.put(import.meta.env.VITE_SERVER_URL + `/api/users`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 200) {
          // alert('用户信息已更新');
          dispatch(setGlobalName(name));
          const newAvatar = response.data.user.avatar;
          if (newAvatar) {
            dispatch(setGlobalAvatar(newAvatar));
          }
          navigate(-1);
        } else {
          console.error('Update failed', response.data);
        }
      } catch (error) {
        if (error.response.status === 409) {
          alert('用户名已被注册');
        } else {
          alert(`更新失败: ${error.response.data.message}`);
        }
        console.error('Update failed', error.response.data);
      }
    } else {
      try {
        const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/api/users', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 201) {
          alert('注册成功，请登录');
          navigate('/users/login');
        } else {
          console.error('Registration failed', response.data);
        }
      } catch (error) {
        if (error.response.status === 409) {
          alert('用户名已被注册');
        } else {
          alert(`注册失败: ${error.response.data.message}`);
        }
        console.error('Registration failed', error.response.data);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
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
          {userId ? "更新" : "注册"}
        </button>
      </form>
    </>
  );
};

export default UserForm;
