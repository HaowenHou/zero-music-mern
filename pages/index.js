import React from 'react';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <div className='text-center'>
      </div>

      <div className="bg-white p-12">
        <div className="flex items-center mb-4 p-4 pb-8 border-b border-gray-600">
          <div className='relative'>
            <img src="/albums/1.png" className='size-28 rounded-lg' />
            <div className="absolute inset-0 flex items-center justify-center">
              {/* absolute top-11 left-11 */}
              <svg className=" bg-white rounded-full size-8 p-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </div>

          </div>

          <div className='pl-8'>
            <h1 className="text-2xl font-bold">我的收藏</h1>
            <button className='flex mt-4 items-center'>
              <svg className='size-11 stroke-1 stroke-gray-800 fill-orange-200' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
              </svg>
              <h2 className='pl-2 text-xl font-bold'>播放歌单</h2>

            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center mb-6">
            <img
              src="/albums/2.png"
              alt="Album Cover"
              className="w-12 h-12 mr-6 rounded-md"
            />
            <div className='flex'>
              <div className='w-64'>
                <h2 className="font-semibold ml-6">Wonderful U</h2>
              </div>
              <p className=''>AGA</p>
            </div>
            <span className="ml-auto">04:08</span>
          </div>

          <div className="flex items-center mb-6">
            <img
              src="/albums/3.png"
              alt="Album Cover"
              className="w-12 h-12 mr-6 rounded-md"
            />
            <div className='flex'>
              <div className='w-64'>
                <h2 className="font-semibold ml-6">Shadow of Mine</h2>
              </div>
              <p className=''>Alec Benjamin</p>
            </div>
            <span className="ml-auto">02:45</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
