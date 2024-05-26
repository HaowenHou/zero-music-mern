import { useState } from 'react';
import { useRouter } from 'next/router';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleSearch = async (event) => {
    const value = event.target.value;
    setQuery(value);
    if (value.length > 2) { // Only search if query length > 2 for performance
      const data = await onSearch(value);
      setResults(data);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleBlur = () => {
    // Hide results when user clicks away from the search bar
    setTimeout(() => setShowResults(false), 200); // Delay to allow click on results
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push(`/search/${query}`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative flex">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onBlur={handleBlur}
          placeholder="搜索"
          className="h-9 w-full px-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
        />
        {showResults && results.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white shadow-lg z-10">
            {results.map((item, index) => (
              <div key={index} className="px-4 py-2 hover:bg-gray-100">
                {item.title}
              </div>
            ))}
          </div>
        )}
        <button type="submit" className='ml-1'>
          <svg className="size-4 ml-1 w-6 h-6 stroke-2 stroke-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
