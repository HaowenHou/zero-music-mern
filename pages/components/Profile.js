import { signOut, useSession } from 'next-auth/react';

const Profile = () => {
    const { data: session } = useSession();

    const handleLogout = () => {
        signOut();
    };

    return (
        <div className="flex flex-col items-center justify-center py-2 bg-gray-100">
            {session ? (
                <div className="p-6 bg-white rounded shadow-md">
                    <h2 className="text-lg font-bold mb-4">已登录</h2>
                    <p><strong>用户名：</strong> {session.user.name}</p>
                    <button onClick={handleLogout} className="mt-6 p-3 bg-red-500 text-white rounded hover:bg-red-600">
                        退出账户
                    </button>
                </div>
            ) : (
                <p>尚未登录</p>
            )}
        </div>
    );
};

export default Profile;
