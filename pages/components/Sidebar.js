import React from 'react';

const Sidebar = () => {
    return (
        <aside className="bg-gray-50 w-64 h-auto">
            <div className='p-4 flex'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 stroke-orange-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                </svg>

                <span className='text-3xl pl-4 pt-0.5 font-bold'>Zero Music</span>
            </div>
            <nav className='text-left pt-8 ml-4 mr-2 flex flex-col gap-2'>
                <div className='text-2xl font-bold text-left pl-6 mb-4'>
                    我的
                </div>
                <a href='/favorites' className='text-lg pl-12 mx-4 py-2 hover:bg-orange-200 hover:rounded-lg'>
                    我的收藏
                </a>
                <a href='/playlists' className='text-lg pl-12 mx-4 py-2 hover:bg-orange-200 hover:rounded-lg'>
                    我的歌单
                </a>
                <a href='/' className='text-lg pl-12 mx-4 py-2 hover:bg-orange-200 hover:rounded-lg'>
                    我的云盘
                </a>
                <div href='/' className='text-2xl font-bold text-left pl-6 mb-4 mt-4'>
                    社区
                </div>
                <a href='/' className='text-lg pl-12 mx-4 py-2 hover:bg-orange-200 hover:rounded-lg'>
                    动态
                </a>
                <a href='/' className='text-lg pl-12 mx-4 py-2 hover:bg-orange-200 hover:rounded-lg'>
                    私信
                </a>
                {/* <a href='/test' className='text-lg pl-12 mx-4 py-2 hover:bg-orange-200 hover:rounded-lg'>
                    测试
                </a> */}
                <a href='/tracks/manage' className='text-lg pl-12 mx-4 py-2 hover:bg-orange-200 hover:rounded-lg'>
                    管理曲库
                </a>
            </nav>
        </aside>
    );
};

export default Sidebar;
