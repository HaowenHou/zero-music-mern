import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await signIn('credentials', {
            redirect: false,
            username,
            password
        });

        if (!result.error) {
            router.push('/');
        } else {
            console.error(result.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-2">
            <form className="px-12 py-8 bg-white rounded shadow-md" onSubmit={handleSubmit}>
                <div className='flex justify-between pb-8'>
                    <Link href="/" className='flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                        首页
                    </Link>
                    <Link href="/register" className='pr-2'>注册</Link>
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
