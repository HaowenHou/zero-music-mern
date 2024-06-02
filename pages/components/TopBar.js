import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import SearchBar from './SearchBar';
import axios from 'axios';
import { useEffect, useState } from 'react';

const TopBar = () => {
  const [name, setName] = useState('');
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isLoading = status === 'loading';

  const fetchSearchResults = async (query) => {
    try {
      const response = await axios.get(`/api/search?q=${query}`);
      return response.data; // Assuming the response data is the array of results
    } catch (error) {
      console.error('Failed to fetch search results', error);
      return [];
    }
  };

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const { data: userData } = await axios.get(`/api/user?uid=${userId}`);
        setName(userData.name);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchUser();
  }, [userId]);

  return (
    <div className="bg-gray-50 h-16 py-4 flex items-center">
      <div className="p-4">
        <SearchBar onSearch={fetchSearchResults} />
      </div>

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
          <div className='flex items-center rounded-3xl border pr-2 mr-4 ml-auto'>
            <img src="/avatars/avatar_1.png" alt="" className='size-9 rounded-full' />
            <div className="px-3">
              {name}
            </div>
            <div className="relative group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="size-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md w-24">
                <Link href={`/profile/${userId}`} className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">个人主页</Link>
                <button onClick={() => signOut()} className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">退出登录</button>
              </div>
            </div>
          </div>
        ))
      }
      {/* <div className='mx-24'></div> */}

    </div>
  );
};

export default TopBar;
