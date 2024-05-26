import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

const SearchBar = () => {
    const { data: session, status } = useSession();
    const isLoading = status === 'loading';
    return (
        <div className="bg-gray-50 h-16 py-4 flex items-center">
            <div className='flex'>
                <input type="text" className='ml-10 w-48 rounded-xl outline-none pl-3' placeholder="搜索音乐" />

                <svg className="size-4 ml-1 w-6 h-6 stroke-2 stroke-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>

            <div className='mx-24'></div>

            {!isLoading &&
                (!session ? (
                    <Link href='/login' className='flex items-center p-0.5 rounded-2xl border mr-8'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                        <div className="ml-2 mr-4 rounded">
                            登录
                        </div>
                    </Link>
                ) : (
                    <div className='flex items-center rounded-2xl border mr-8'>
                        <img src="/avatars/avatar_1.png" alt="" className='size-8 rounded-full' />
                        <div className="px-3">
                            {session.user.name}
                        </div>
                        <div className="relative group">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                className="size-5 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                            <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md w-24">
                                <Link href="" className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">个人主页</Link>
                                <button onClick={() => signOut()} className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">退出登录</button>
                            </div>
                        </div>
                    </div>
                ))
            }
            <div className='mx-24'></div>

        </div>
    );
};

export default SearchBar;
