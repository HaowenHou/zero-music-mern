import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  // Check if the path is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
    return false; // TODO
  };

  const { role } = useSelector(state => state.userState);

  return (
    <aside className="bg-gray-50 min-w-60">
      <Link to="/" className='p-4 flex items-center justify-center'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9 stroke-orange-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
        </svg>

        <span className='text-2xl pl-4  font-bold'>Zero Music</span>
      </Link>
      <nav className='text-left pt-8 ml-4 mr-2 flex flex-col gap-2'>
        <div className='text-2xl font-bold text-left pl-6 mb-4'>
          {t("my")}
        </div>
        <Link to='/favorites' className={`text-lg pl-12 mx-4 py-2  hover:rounded-lg ${isActive('/favorites') ? 'bg-orange-300 rounded-lg' : 'hover:bg-orange-200'}`}>
          {t("myFavorites")}
        </Link>
        <Link to='/playlists' className={`text-lg pl-12 mx-4 py-2  hover:rounded-lg ${isActive('/playlists') ? 'bg-orange-300 rounded-lg' : 'hover:bg-orange-200'}`}>
          {t("myPlaylists")}
        </Link>
        <Link to='/drive' className={`text-lg pl-12 mx-4 py-2  hover:rounded-lg ${isActive('/drive') ? 'bg-orange-300 rounded-lg' : 'hover:bg-orange-200'}`}>
          {t("myDrive")}
        </Link>
        <div className='text-2xl font-bold text-left pl-6 mb-4 mt-4'>
          {t("community")}
        </div>
        <Link to='/posts' className={`text-lg pl-12 mx-4 py-2  hover:rounded-lg ${isActive('/posts') ? 'bg-orange-300 rounded-lg' : 'hover:bg-orange-200'}`}>
          {t("posts")}
        </Link>
        <Link to='/chat' className={`text-lg pl-12 mx-4 py-2  hover:rounded-lg ${isActive('/chat') ? 'bg-orange-300 rounded-lg' : 'hover:bg-orange-200'}`}>
          {t("messages")}
        </Link>
        {role === 'admin' && (
          <Link to='/tracks/manage' className={`text-lg pl-12 mx-4 py-2  hover:rounded-lg ${isActive('/tracks') ? 'bg-orange-300 rounded-lg' : 'hover:bg-orange-200'}`}>
            {t("manageTracks")}
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
