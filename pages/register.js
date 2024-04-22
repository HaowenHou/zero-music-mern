import axios from 'axios';
import { useState } from 'react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {username, password};

        try {
            const response = await axios.post('/api/register', formData);
            console.log('Registration successful', response.data);
        } catch (error) {
            console.error('Registration failed', error.response.data);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-2 bg-gray-100">
            <form className="p-6 bg-white rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold mb-8">新用户注册</h2>
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
                    <label htmlFor="password" className="block mb-2">密码</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
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
