import { useState } from 'react';
import { signIn } from 'next-auth/react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await signIn('credentials', {
            redirect: false,
            username,
            password
        });

        if (!result.error) {
            // set some form of success state
            console.log("Logged in successfully!");
        } else {
            // Handle errors here, such as showing a notification
            console.error(result.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form className="p-6 bg-white rounded shadow-md" onSubmit={handleSubmit}>
                <h2 className="text-lg font-bold mb-8">Login</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2">Username</label>
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
                    <label htmlFor="password" className="block mb-2">Password</label>
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
                <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Log in
                </button>
            </form>
        </div>
    );
};

export default Login;
