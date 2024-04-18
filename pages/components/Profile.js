import { signOut, useSession } from 'next-auth/react';

const Profile = () => {
    const { data: session } = useSession();

    const handleLogout = () => {
        signOut();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {session ? (
                <div className="p-6 bg-white rounded shadow-md">
                    <h2 className="text-lg font-bold mb-4">Profile</h2>
                    <p><strong>Username:</strong> {session.user.name}</p>
                    <button onClick={handleLogout} className="mt-6 p-3 bg-red-500 text-white rounded hover:bg-red-600">
                        Log out
                    </button>
                </div>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
};

export default Profile;
