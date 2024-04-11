import React from 'react';

const SearchBar = () => {
    return (
        <div className="bg-gray-50 h-16 py-4 flex items-center">
            <input type="text" className='ml-10 w-48 rounded-xl outline-none pl-3' placeholder="搜索音乐" />
            
            <svg className="size-4 ml-1 w-6 h-6 stroke-2 stroke-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

        </div>
    );
};

export default SearchBar;
