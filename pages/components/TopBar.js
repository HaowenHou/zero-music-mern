import React from 'react';
import { signOut, useSession } from 'next-auth/react';

const SearchBar = () => {
    const { data: session } = useSession();
    return (
        <div className="bg-gray-50 h-16 py-4 flex items-center">
            <div className='flex'>
                <input type="text" className='ml-10 w-48 rounded-xl outline-none pl-3' placeholder="搜索音乐" />

                <svg className="size-4 ml-1 w-6 h-6 stroke-2 stroke-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>
            
            {!session ? (
                <a href='/login' className='ml-24 mr-24 flex items-center bg-orange-200 rounded-2xl'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>

                    <label className="ml-2 mr-3 rounded">
                        登录
                    </label>
                </a>
            ) : (
                <button className="p-3 bg-red-500 text-white rounded hover:bg-red-600">
                    退出
                </button>
            )}
            
        </div>
    );
};

export default SearchBar;
