import React from 'react';
// import { signOut, useSession } from 'next-auth/react'; // TODO: signout
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import axios from 'axios';
import { useEffect, useState } from 'react';

const TopBar = () => {
  const session = undefined;
  const userId = session?.user?.id;
  const name = session?.user?.name;
  const isLoading = true && status === 'loading';
  const [inElectron, setInElectron] = useState(false);

  const handleClose = () => {
    window.electron.close();
  };

  const handleMinimize = () => {
    window.electron.minimize();
  };

  const handleMaximize = () => {
    window.electron.maximize();
  };

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
    if (window.electron !== undefined) {
      setInElectron(true);
    }
  }, []);

  return (
    <div className="bg-gray-50 h-16 py-4 flex items-center" style={{ WebkitAppRegion: 'drag', WebkitUserSelect: 'none' }}>
      <div className="p-4" style={{ WebkitAppRegion: 'no-drag' }}>
        <SearchBar onSearch={fetchSearchResults} />
      </div>

    <div className='h-16 ml-auto flex items-center justify-center' style={{ WebkitAppRegion: 'no-drag' }}>
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
          <div className='flex items-center rounded-3xl border pr-2 mr-4 ml-auto' style={{ WebkitAppRegion: 'no-drag' }}>
            <img src="/avatars/avatar_1.png" alt="" className='size-9 rounded-full' />
            <div className="px-3">
              {name}
            </div>
            <div className="relative group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="size-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md w-24 -left-20">
                <Link href={`/profile/${userId}`} className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">个人主页</Link>
                <button onClick={() => {}} className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">退出登录</button>
              </div>
            </div>
          </div>
        ))
      }
    </div>

      {inElectron &&
        <div className="flex justify-end space-x-2 p-2" style={{ WebkitAppRegion: 'no-drag' }}>
          <button onClick={handleMinimize} className="bg-gray-50 hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          </button>
          <button onClick={handleMaximize} className="bg-gray-50 hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          </button>
          <button onClick={handleClose} className="bg-grey-50 hover:bg-red-400 w-8 h-8 flex items-center justify-center rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      }

    </div>
  );
};

export default TopBar;
